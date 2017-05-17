futronics.controller('marketmycampaignControllers', function($scope,$cordovaSocialSharing) {
    $scope.socialLists = [
        {text: 'Facebook'},
        {text: 'Twitter'},
        {text: 'Text Message'},
        {text: 'Email'}
    ];
    $scope.checkItems = {};
    $scope.checkItemsCollection = [];

    var message = 'This is a dummy message';
    var subject = 'This is a dummy subject';

    function getChecked(){
        for(var i in $scope.checkItems) {
            if($scope.checkItems[i] == true) {
                $scope.checkItemsCollection.push(i);
            }
        }
    }

    function shareVia(){

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

    $scope.shareContent = function (){
        console.log("Share it");
        getChecked();
        shareVia();
        $scope.checkItemsCollection = [];
    };

    $scope.shareApp = function (){
        console.log("Share this app");    
    };
});