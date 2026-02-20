import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type UserId = Principal;
  type ProductId = Nat;
  type OrderId = Nat;
  type ArticleId = Nat;
  type Transform = OutCall.Transform;

  type FoodEntry = {
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

  type Product = {
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

  public type FoodEntryInput = {
    foodName : Text;
    calories : Float;
    protein : Float;
    carbs : Float;
    fat : Float;
    servingSize : Float;
  };

  public type NewsCategory = {
    #workoutTips;
    #nutrition;
    #sportsNews;
    #trainingAdvice;
    #productReviews;
    #mentalHealth;
    #fitnessLifestyle;
  };

  public type ArticleType = {
    #internal;
    #external;
  };

  public type NewsArticle = {
    id : ArticleId;
    title : Text;
    content : Text;
    author : Text;
    publicationDate : Int;
    category : NewsCategory;
    featuredImageUrl : Text;
    articleType : ArticleType;
    externalUrl : ?Text;
    creationTimestamp : Int;
    creatorUserId : UserId;
  };

  public type NewsArticleInput = {
    title : Text;
    content : Text;
    author : Text;
    publicationDate : Int;
    category : NewsCategory;
    featuredImageUrl : Text;
    articleType : ArticleType;
    externalUrl : ?Text;
  };

  type ArticleSummary = {
    id : ArticleId;
    title : Text;
    author : Text;
    publicationDate : Int;
    category : NewsCategory;
    featuredImageUrl : Text;
    articleType : ArticleType;
  };

  type RunningSessionSummary = {
    runId : Nat;
    distance : Float;
    duration : Nat;
    timestamp : Int;
    notes : ?Text;
  };

  type ProductCategory = {
    #clothing;
    #equipment;
    #supplements;
    #trainingAids;
    #accessories;
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

  public type SearchResult = {
    contentType : Text;
    itemId : Nat;
    title : Text;
    previewText : Text;
    relevanceScore : Float;
  };

  type FitnessExternalSearchResult = {
    resultType : Text;
    title : Text;
    preview : Text;
    sourceUrl : Text;
    source : Text;
  };

  type SportsProduct = {
    id : Text;
    name : Text;
    description : Text;
    price : Float;
    imageUrl : Text;
    category : Text;
    externalProductUrl : Text;
  };

  type VideoContent = {
    id : Text;
    title : Text;
    description : Text;
    thumbnailUrl : Text;
    videoUrl : Text;
    uploader : Text;
    viewCount : ?Nat;
    duration : Nat;
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
  var articles = Map.empty<ArticleId, NewsArticle>();
  var articleIdCounter : ArticleId = 0;
  var foodEntries = Map.empty<Nat, FoodEntry>();
  var foodEntryIdCounter : Nat = 0;
  var userFoodEntries = Map.empty<Principal, List.List<Nat>>();

  let externalSportsProductsEndpoint = "https://workoutpuppy.com/api/marketplace";
  let externalSportsVideosEndpoint = "https://workoutpuppy.com/api/youtube";

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func fetchExternalProducts() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch external products");
    };
    let url = "https://gostore.icp0.io/api/products";
    await OutCall.httpGetRequest(url, [], transform);
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let productsValues = products.values().toArray();
    let filteredProducts = productsValues.filter(
      func(product) {
        product.name.contains(#text searchTerm) or product.description.contains(#text searchTerm);
      }
    );
    filteredProducts;
  };

  public query ({ caller }) func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
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

  public query ({ caller }) func getAllVideos() : async [Video] {
    let valuesIter = videos.values();
    valuesIter.toArray();
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

  public query ({ caller }) func getAllNewsArticles(categoryFilter : ?NewsCategory) : async [NewsArticle] {
    let result = List.empty<NewsArticle>();
    for ((_, article) in articles.entries()) {
      switch (categoryFilter) {
        case (null) { result.add(article) };
        case (?filter) {
          if (article.category == filter) { result.add(article) };
        };
      };
    };

    result.toArray();
  };

  public query ({ caller }) func getNewsArticle(articleId : ArticleId) : async ?NewsArticle {
    articles.get(articleId);
  };

  public query ({ caller }) func getAllArticlesSortedByPublicationDate() : async [NewsArticle] {
    let entries = articles.toArray();
    let articlesArray = entries.map(func((_, article)) { article });
    articlesArray;
  };

  public query ({ caller }) func getArticleSummaries() : async [ArticleSummary] {
    let summaries = List.empty<ArticleSummary>();
    for ((_, article) in articles.entries()) {
      let summary : ArticleSummary = {
        id = article.id;
        title = article.title;
        author = article.author;
        publicationDate = article.publicationDate;
        category = article.category;
        featuredImageUrl = article.featuredImageUrl;
        articleType = article.articleType;
      };
      summaries.add(summary);
    };
    summaries.toArray();
  };

  public query ({ caller }) func searchContent(searchTerm : Text) : async [SearchResult] {
    let results = List.empty<SearchResult>();

    // Search public content (products, videos, articles) - accessible to all
    let productValues = products.values().toArray();
    for (product in productValues.values()) {
      if (product.name.contains(#text searchTerm) or product.description.contains(#text searchTerm)) {
        let result : SearchResult = {
          contentType = "product";
          itemId = product.id;
          title = product.name;
          previewText = product.description;
          relevanceScore = calculateRelevanceScore(product.name, product.description, searchTerm);
        };
        results.add(result);
      };
    };

    let videoValues = videos.values().toArray();
    for (video in videoValues.values()) {
      if (video.title.contains(#text searchTerm) or video.description.contains(#text searchTerm)) {
        let result : SearchResult = {
          contentType = "video";
          itemId = video.id;
          title = video.title;
          previewText = video.description;
          relevanceScore = calculateRelevanceScore(video.title, video.description, searchTerm);
        };
        results.add(result);
      };
    };

    let articleValues = articles.values().toArray();
    for (article in articleValues.values()) {
      if (article.title.contains(#text searchTerm) or article.content.contains(#text searchTerm) or article.author.contains(#text searchTerm)) {
        let result : SearchResult = {
          contentType = "article";
          itemId = article.id;
          title = article.title;
          previewText = article.content;
          relevanceScore = calculateRelevanceScore(article.title, article.content, searchTerm);
        };
        results.add(result);
      };
    };

    // Search private content (workouts, running sessions, food entries) - only for authenticated users
    if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      // Search user's own workouts
      switch (workouts.get(caller)) {
        case (null) {};
        case (?userWorkouts) {
          for (workout in userWorkouts.values()) {
            if (workout.exerciseName.contains(#text searchTerm)) {
              let result : SearchResult = {
                contentType = "workout";
                itemId = 0; // Workouts don't have IDs in current implementation
                title = workout.exerciseName;
                previewText = "Sets: " # Nat.toText(workout.sets) # ", Reps: " # Nat.toText(workout.reps);
                relevanceScore = calculateRelevanceScore(workout.exerciseName, workout.exerciseName, searchTerm);
              };
              results.add(result);
            };
          };
        };
      };

      // Search user's own running sessions
      for ((_, session) in runningSessions.entries()) {
        if (session.userId == caller) {
          switch (session.notes) {
            case (null) {};
            case (?notes) {
              if (notes.contains(#text searchTerm)) {
                let result : SearchResult = {
                  contentType = "runningSession";
                  itemId = session.runId;
                  title = "Running Session";
                  previewText = notes;
                  relevanceScore = calculateRelevanceScore("Running Session", notes, searchTerm);
                };
                results.add(result);
              };
            };
          };
        };
      };

      // Search user's own food entries
      switch (userFoodEntries.get(caller)) {
        case (null) {};
        case (?entryIds) {
          for (entryId in entryIds.values()) {
            switch (foodEntries.get(entryId)) {
              case (null) {};
              case (?entry) {
                if (entry.foodName.contains(#text searchTerm)) {
                  let result : SearchResult = {
                    contentType = "foodEntry";
                    itemId = entry.id;
                    title = entry.foodName;
                    previewText = "Calories: " # Float.toText(entry.calories);
                    relevanceScore = calculateRelevanceScore(entry.foodName, entry.foodName, searchTerm);
                  };
                  results.add(result);
                };
              };
            };
          };
        };
      };
    };

    results.toArray();
  };

  public shared ({ caller }) func getExternalFitnessSearchResults(searchTerm : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform external fitness searches");
    };

    let search_url = "https://external-fitness-api.icp0.io/api/search?query=" # searchTerm;
    await OutCall.httpGetRequest(search_url, [], transform);
  };

  public shared ({ caller }) func fetchExternalSportsProducts(categoryFilter : ?Text, searchTerm : ?Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch external sports products");
    };

    let baseUrl = externalSportsProductsEndpoint;
    var url = baseUrl;

    switch (categoryFilter, searchTerm) {
      case (?category, ?search) {
        url #= "?category=" # category # "&search=" # search;
      };
      case (?category, null) {
        url #= "?category=" # category;
      };
      case (null, ?search) {
        url #= "?search=" # search;
      };
      case (null, null) {};
    };

    await OutCall.httpGetRequest(url, [], transform);
  };

  public shared ({ caller }) func fetchSportsAndFitnessVideos() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch sports and fitness videos");
    };

    await OutCall.httpGetRequest(externalSportsVideosEndpoint, [], transform);
  };

  func calculateRelevanceScore(title : Text, content : Text, searchTerm : Text) : Float {
    let titleMatches = if (title.contains(#text searchTerm)) { 1.0 } else { 0.0 };
    let contentMatches = if (content.contains(#text searchTerm)) { 1.0 } else { 0.0 };
    0.7 * titleMatches + 0.3 * contentMatches;
  };
};
