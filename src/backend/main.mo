import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type UserId = Principal;
  type ProductId = Nat;
  type OrderId = Nat;

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat;
    quantity : Nat;
    image : ?Storage.ExternalBlob;
    isInternal : Bool;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
  };

  public type CartItem = {
    productId : ProductId;
    quantity : Nat;
  };

  public type Order = {
    id : OrderId;
    userId : UserId;
    items : [CartItem];
    status : OrderStatus;
    total : Nat;
    shippingAddress : Text;
  };

  public type Workout = {
    exerciseName : Text;
    sets : Nat;
    reps : Nat;
    weight : Nat;
  };

  public type Video = {
    id : Nat;
    title : Text;
    description : Text;
    videoFile : Storage.ExternalBlob;
    uploaderId : Principal;
    uploadTimestamp : Int;
    likeCount : Nat;
    commentCount : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type ProductDetails = {
    name : Text;
    description : Text;
    price : Nat;
    quantity : Nat;
    image : ?Storage.ExternalBlob;
  };

  type RunningSession = {
    runId : Nat;
    userId : Principal;
    distance : Float;
    duration : Nat;
    timestamp : Int;
    notes : ?Text;
  };

  public type Comment = {
    id : Nat;
    videoId : Nat;
    userId : Principal;
    text : Text;
    timestamp : Int;
  };

  public type FoodEntry = {
    id : Nat;
    userId : Principal;
    foodName : Text;
    calories : Float;
    protein : Float;
    carbs : Float;
    fat : Float;
    servingSize : Float;
    timestamp : Int;
  };

  public type FoodEntryInput = {
    foodName : Text;
    calories : Float;
    protein : Float;
    carbs : Float;
    fat : Float;
    servingSize : Float;
  };

  type NutritionixSearchResult = {
    food_name : Text;
    brand_name : ?Text;
    serving_qty : Float;
    serving_unit : Text;
    nf_calories : Float;
    nf_protein : Float;
    nf_total_carbohydrate : Float;
    nf_total_fat : Float;
  };

  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, Order>();
  let carts = Map.empty<UserId, List.List<CartItem>>();
  let workouts = Map.empty<UserId, [Workout]>();
  var videos = Map.empty<Nat, Video>();
  var runningSessions = Map.empty<Nat, RunningSession>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var videoLikes = Map.empty<Nat, Map.Map<Principal, Bool>>();
  var comments = Map.empty<Nat, Comment>();
  var videoComments = Map.empty<Nat, List.List<Nat>>();

  var videoIdCounter = 0;
  var runningSessionIdCounter = 0;
  var commentIdCounter = 0;

  var foodEntries = Map.empty<Nat, FoodEntry>();
  var foodEntryIdCounter = 0;
  var userFoodEntries = Map.empty<Principal, List.List<Nat>>();

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func fetchExternalProducts() : async Text {
    let url = "https://gostore.icp0.io/api/products";
    await OutCall.httpGetRequest(url, [], transform);
  };

  public shared ({ caller }) func addProduct(productDetails : ProductDetails) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let newProduct : Product = {
      id = products.size();
      name = productDetails.name;
      description = productDetails.description;
      price = productDetails.price;
      quantity = productDetails.quantity;
      image = productDetails.image;
      isInternal = true;
    };

    products.add(newProduct.id, newProduct);
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let productsValues = products.values().toArray();
    let iter = productsValues.values();
    let mappedIter = iter.filter(func(product) { product.name.contains(#text searchTerm) or product.description.contains(#text searchTerm) });
    mappedIter.toArray();
  };

  public query ({ caller }) func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func editProduct(id : ProductId, productDetails : ProductDetails) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existing) {
        let updatedProduct : Product = {
          existing with
          name = productDetails.name;
          description = productDetails.description;
          price = productDetails.price;
          quantity = productDetails.quantity;
          image = productDetails.image;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };

    products.remove(id);
  };

  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?cart) { cart };
    };

    let existingItemIndex = currentCart.findIndex(func(cartItem) { cartItem.productId == item.productId });

    switch (existingItemIndex) {
      case (null) {
        currentCart.add(item);
      };
      case (?index) {
        let cartItem = currentCart.at(index);
        let updatedItem = {
          cartItem with
          quantity = cartItem.quantity + item.quantity;
        };
        currentCart.put(index, updatedItem);
      };
    };

    carts.add(caller, currentCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };

    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  public shared ({ caller }) func placeOrder(shippingAddress : Text) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };

    if (cart.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    var total = 0;
    for (item in cart.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found in cart") };
        case (?product) {
          total += product.price * item.quantity;
        };
      };
    };

    let orderId = orders.size();
    let order : Order = {
      id = orderId;
      userId = caller;
      items = cart.toArray();
      status = #pending;
      total;
      shippingAddress;
    };

    orders.add(orderId, order);
    carts.remove(caller);

    orderId;
  };

  public query ({ caller }) func getOrder(id : OrderId) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };

    let userOrders = List.empty<Order>();
    for ((_, order) in orders.entries()) {
      if (order.userId == caller) {
        userOrders.add(order);
      };
    };

    userOrders.toArray();
  };

  public shared ({ caller }) func logWorkout(workout : Workout) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log workouts");
    };

    let userWorkouts = switch (workouts.get(caller)) {
      case (null) { [] };
      case (?existingWorkouts) { existingWorkouts };
    };

    let newWorkouts = List.fromArray<Workout>(userWorkouts);
    newWorkouts.add(workout);

    workouts.add(caller, newWorkouts.toArray());
  };

  public query ({ caller }) func getWorkouts() : async [Workout] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their workouts");
    };

    switch (workouts.get(caller)) {
      case (null) { [] };
      case (?userWorkouts) { userWorkouts };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func uploadVideo(title : Text, description : Text, file : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload videos");
    };

    let newVideo : Video = {
      id = videoIdCounter;
      title;
      description;
      videoFile = file;
      uploaderId = caller;
      uploadTimestamp = 0;
      likeCount = 0;
      commentCount = 0;
    };

    videos.add(videoIdCounter, newVideo);
    videoLikes.add(videoIdCounter, Map.empty<Principal, Bool>());
    videoComments.add(videoIdCounter, List.empty<Nat>());
    videoIdCounter += 1;
    newVideo.id;
  };

  public query ({ caller }) func getVideo(id : Nat) : async ?Video {
    videos.get(id);
  };

  public query ({ caller }) func getAllVideos() : async [Video] {
    let valuesIter = videos.values();
    valuesIter.toArray();
  };

  public shared ({ caller }) func likeVideo(videoId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like videos");
    };

    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) {
        let likes = switch (videoLikes.get(videoId)) {
          case (null) { Map.empty<Principal, Bool>() };
          case (?existingLikes) { existingLikes };
        };

        if (likes.containsKey(caller)) {
          Runtime.trap("Already liked this video");
        };

        likes.add(caller, true);
        videoLikes.add(videoId, likes);

        let updatedVideo = {
          video with
          likeCount = video.likeCount + 1;
        };
        videos.add(videoId, updatedVideo);
      };
    };
  };

  public shared ({ caller }) func unlikeVideo(videoId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlike videos");
    };

    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) {
        let likes = switch (videoLikes.get(videoId)) {
          case (null) { Runtime.trap("Video has no likes") };
          case (?existingLikes) { existingLikes };
        };

        if (not likes.containsKey(caller)) {
          Runtime.trap("Haven't liked this video");
        };

        likes.remove(caller);
        videoLikes.add(videoId, likes);

        let updatedVideo = {
          video with
          likeCount = if (video.likeCount > 0) { video.likeCount - 1 } else { 0 };
        };
        videos.add(videoId, updatedVideo);
      };
    };
  };

  public query ({ caller }) func hasLikedVideo(videoId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check like status");
    };

    switch (videoLikes.get(videoId)) {
      case (null) { false };
      case (?likes) { likes.containsKey(caller) };
    };
  };

  public query ({ caller }) func getVideoLikeCount(videoId : Nat) : async Nat {
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) { video.likeCount };
    };
  };

  public shared ({ caller }) func addComment(videoId : Nat, text : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };

    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) {
        let newComment : Comment = {
          id = commentIdCounter;
          videoId;
          userId = caller;
          text;
          timestamp = 0;
        };

        comments.add(commentIdCounter, newComment);

        let videoCommentList = switch (videoComments.get(videoId)) {
          case (null) { List.empty<Nat>() };
          case (?existingComments) { existingComments };
        };
        videoCommentList.add(commentIdCounter);
        videoComments.add(videoId, videoCommentList);

        let updatedVideo = {
          video with
          commentCount = video.commentCount + 1;
        };
        videos.add(videoId, updatedVideo);

        commentIdCounter += 1;
        newComment.id;
      };
    };
  };

  public query ({ caller }) func getVideoComments(videoId : Nat) : async [Comment] {
    let commentIds = switch (videoComments.get(videoId)) {
      case (null) { return [] };
      case (?ids) { ids };
    };

    let result = List.empty<Comment>();
    for (commentId in commentIds.values()) {
      switch (comments.get(commentId)) {
        case (null) {};
        case (?comment) { result.add(comment) };
      };
    };

    result.toArray();
  };

  public shared ({ caller }) func deleteComment(commentId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete comments");
    };

    switch (comments.get(commentId)) {
      case (null) { Runtime.trap("Comment not found") };
      case (?comment) {
        if (comment.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own comments");
        };

        comments.remove(commentId);

        let videoCommentList = switch (videoComments.get(comment.videoId)) {
          case (null) { List.empty<Nat>() };
          case (?existingComments) { existingComments };
        };

        let filteredComments = videoCommentList.filter(func(id) { id != commentId });
        videoComments.add(comment.videoId, filteredComments);

        switch (videos.get(comment.videoId)) {
          case (null) {};
          case (?video) {
            let updatedVideo = {
              video with
              commentCount = if (video.commentCount > 0) { video.commentCount - 1 } else { 0 };
            };
            videos.add(comment.videoId, updatedVideo);
          };
        };
      };
    };
  };

  public shared ({ caller }) func logRunningSession(distance : Float, duration : Nat, notes : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log running sessions");
    };

    let newSession : RunningSession = {
      runId = runningSessionIdCounter;
      userId = caller;
      distance;
      duration;
      timestamp = 0;
      notes;
    };

    runningSessions.add(runningSessionIdCounter, newSession);
    runningSessionIdCounter += 1;
    newSession.runId;
  };

  public query ({ caller }) func getRunningSession(id : Nat) : async ?RunningSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view running sessions");
    };

    switch (runningSessions.get(id)) {
      case (null) { null };
      case (?session) {
        if (session.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own running sessions");
        };
        ?session;
      };
    };
  };

  public query ({ caller }) func getUserRunningSessions() : async [RunningSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view running sessions");
    };

    let userSessions = List.empty<RunningSession>();
    for ((_, session) in runningSessions.entries()) {
      if (session.userId == caller) {
        userSessions.add(session);
      };
    };

    userSessions.toArray();
  };

  public query ({ caller }) func getAllRunningSessions() : async [RunningSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all running sessions");
    };

    let valuesIter = runningSessions.values();
    valuesIter.toArray();
  };

  public shared ({ caller }) func deleteRunningSession(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete running sessions");
    };

    switch (runningSessions.get(id)) {
      case (null) { Runtime.trap("Running session not found") };
      case (?session) {
        if (session.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own running sessions");
        };
        runningSessions.remove(id);
      };
    };
  };

  // Food & Nutrition Features

  public query ({ caller }) func getUserFoodEntries() : async [FoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view food entries");
    };

    let entryIds = switch (userFoodEntries.get(caller)) {
      case (null) { return [] };
      case (?ids) { ids };
    };

    let result = List.empty<FoodEntry>();
    for (entryId in entryIds.values()) {
      switch (foodEntries.get(entryId)) {
        case (null) {};
        case (?entry) { result.add(entry) };
      };
    };

    result.toArray();
  };

  public shared ({ caller }) func addFoodEntry(food : FoodEntryInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add food entries");
    };

    let now = Time.now();
    let newEntry : FoodEntry = {
      id = foodEntryIdCounter;
      userId = caller;
      foodName = food.foodName;
      calories = food.calories;
      protein = food.protein;
      carbs = food.carbs;
      fat = food.fat;
      servingSize = food.servingSize;
      timestamp = now;
    };

    foodEntries.add(foodEntryIdCounter, newEntry);

    let currentUserEntries = switch (userFoodEntries.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?entries) { entries };
    };
    currentUserEntries.add(foodEntryIdCounter);
    userFoodEntries.add(caller, currentUserEntries);

    foodEntryIdCounter += 1;
    newEntry.id;
  };

  public query ({ caller }) func getFoodEntry(entryId : Nat) : async ?FoodEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get food entries");
    };

    switch (foodEntries.get(entryId)) {
      case (null) { null };
      case (?entry) {
        if (entry.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own food entries");
        };
        ?entry;
      };
    };
  };

  public query ({ caller }) func getUserFoodEntryCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access food entries");
    };
    switch (userFoodEntries.get(caller)) {
      case (null) { 0 };
      case (?entries) { entries.size() };
    };
  };

  public shared ({ caller }) func editFoodEntry(entryId : Nat, food : FoodEntryInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can edit food entries");
    };

    switch (foodEntries.get(entryId)) {
      case (null) { Runtime.trap("Food entry not found") };
      case (?existing) {
        if (existing.userId != caller) {
          Runtime.trap("Unauthorized: Can only edit your own food entries");
        };

        let updatedFoodEntry : FoodEntry = {
          existing with
          foodName = food.foodName;
          calories = food.calories;
          protein = food.protein;
          carbs = food.carbs;
          fat = food.fat;
          servingSize = food.servingSize;
        };
        foodEntries.add(entryId, updatedFoodEntry);
      };
    };
  };

  public shared ({ caller }) func deleteFoodEntry(entryId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete food entries");
    };

    switch (foodEntries.get(entryId)) {
      case (null) { Runtime.trap("Food entry not found") };
      case (?entry) {
        if (entry.userId != caller) {
          Runtime.trap("Unauthorized: Can only delete your own food entries");
        };
        foodEntries.remove(entryId);

        let currentUserEntries = switch (userFoodEntries.get(caller)) {
          case (null) { List.empty<Nat>() };
          case (?entries) { entries };
        };
        let filteredEntries = currentUserEntries.filter(func(id) { id != entryId });
        userFoodEntries.add(caller, filteredEntries);
      };
    };
  };
};
