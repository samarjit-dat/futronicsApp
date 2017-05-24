futronics.controller('marketmycampaignControllers', 
function($scope,$rootScope,$cordovaContacts,$cordovaSocialSharing,URL) {
    $scope.socialLists = [
        {text: 'Facebook'},
        {text: 'Twitter'},
        {text: 'Text Message'},
        {text: 'Email'}
    ];
    $scope.checkItems = {};
    $scope.checkItemsCollection = [];

    $scope.message = 'This is a dummy message';
    var subject = 'This is a dummy subject';
    
    var user_id = $rootScope.userId || $rootScope.user_id;

    if(user_id > 0){
        $scope.message = URL.BASE+'fundingformaintencephase/funding/'+user_id
    }

    function getChecked(){
        for(var i in $scope.checkItems) {
            if($scope.checkItems[i] == true) {
                $scope.checkItemsCollection.push(i);
            }
        }
    }

    function shareVia(_message){
        var message = _message;
        $scope.checkItemsCollection.forEach(function(element) {
            switch(element){
                case 'Facebook':
                console.log("share in facebook");
                    $cordovaSocialSharing
                        .shareViaFacebook(message, subject)
                        .then(function(result) {
                            // Success!
                            console.log("Success");
                            console.log(result);
                       }, function(err) {
                            // An error occured. Show a message to the user
                            console.log("Error");
                            console.log(err);
                        });
                break;
                case 'Twitter':
                    console.log("share in twitter");
                    $cordovaSocialSharing
                        .shareViaTwitter(message, subject)
                        .then(function(result) {
                            // Success!
                            console.log("Success");
                            console.log(result);
                        }, function(err) {
                            // An error occured. Show a message to the user
                            console.log("Error");
                            console.log(err);
                        });
                break;
                case 'Text Message':
                    console.log("share in text message");
                    /**** txt msg */
                    // $scope.addContact = function() {
                    //     $cordovaContacts.save($scope.contactForm).then(function(result) {
                    //     // Contact saved
                    //     }, function(err) {
                    //     // Contact error
                    //     });
                    // };

                    // $scope.getAllContacts = function() {
                    //     $cordovaContacts.find().then(function(allContacts) { //omitting parameter to .find() causes all contacts to be returned
                    //         $scope.contacts = allContacts;
                    //     });
                    // };

                    // $scope.findContactsBySearchTerm = function (searchTerm) {
                    //     var opts = {                                           //search options
                    //         filter : searchTerm,                                 // 'Bob'
                    //         multiple: true,                                      // Yes, return any contact that matches criteria
                    //         fields:  [ 'displayName', 'name' ],                   // These are the fields to search for 'bob'.
                    //         desiredFields: [id]    //return fields.
                    //     };

                    //     if ($ionicPlatform.isAndroid()) {
                    //         opts.hasPhoneNumber = true;         //hasPhoneNumber only works for android.
                    //     };

                    //         $cordovaContacts.find(opts).then(function (contactsFound) {
                    //         $scope.contacts = contactsFound;
                    //     });
                    // }

                    // $scope.pickContactUsingNativeUI = function () {
                    //     $cordovaContacts.pickContact().then(function (contactPicked) {
                    //         $scope.contact = contactPicked;
                    //     });
                    // };
                    /*** txt msg */
                    $cordovaSocialSharing
                        .shareViaSMS(message, '0612345678')
                        .then(function(result) {
                            // Success!
                            console.log("Success");
                            console.log(result);
                        }, function(err) {
                            // An error occured. Show a message to the user
                            console.log("Error");
                            console.log(err);
                        });
                break;
                case 'Email':
                    console.log("share in email");
                    $cordovaSocialSharing
                        .shareViaEmail(message, subject)
                        .then(function(result) {
                            // Success!
                            console.log("Success");
                            console.log(result);
                        }, function(err) {
                            // An error occured. Show a message to the user
                            console.log("Error");
                            console.log(err);
                        });
                break;
            }
        }, this);

    }

    $scope.shareContent = function (message){
        console.log("Share it");
        getChecked();
        shareVia(message);
        $scope.checkItemsCollection = [];
    };

    $scope.shareApp = function (message){
        console.log("Share this app");
        $cordovaSocialSharing
        .share(message, subject, file, link) // Share via native share sheet
        .then(function(result) {
        // Success!
        }, function(err) {
        // An error occured. Show a message to the user
        });
    };
});