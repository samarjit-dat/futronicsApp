futronics.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
    
      // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.backButton.previousTitleText(false);
    /*
    // Turn off back button text
    */
  $stateProvider
   .state('globalChat', {
        url: "/globalChat",
        templateUrl: "templates/GlobalChat/globalChat.html",
        controller: 'globalChatControllers'
          
       
   })
  .state('upload-video', {
        url: "/upload-video",
        templateUrl: "templates/videoupload.html",
        controller: 'VideoUploadCtrl'
  }) 
  .state('myCampaign', {
        url: "/myCampaign",
        templateUrl: 'templates/marketmycampaign.html',
        controller: 'marketmycampaignControllers'
          
       
  }) 
  .state('login', {
    url: '/login',
    templateUrl: 'templates/Account/Login/login.html',
    controller: 'LoginControllers'
  
  })
  .state('signup', {
    url: '/signup',
    params : {
      motivationAmount : null,
      fromEndCampaign : null
    },
    templateUrl: 'templates/Account/Signup/signup.html',
    controller: 'SignupControllers'
  
  })
  .state('campaignBrowse', {
    url: '/campaignBrowse',
    params : {
      motivationAmount : null
    },
    templateUrl: 'templates/CampaignBrowse/campaignBrowse.html',
    controller: 'campaignBrowseControllers'
  
  })

  .state('chat', {
    url: '/chat',
    templateUrl: 'templates/Chat/chat.html',
    controller: 'ChatCtrl'
  
  })

  .state('profile', {
    url: '/profile',
    params:{
        id:null
    },
    templateUrl: 'templates/Profile/profile.html',
    controller: 'ProfileCtrl'
    
  
  })
  .state('profileViewStats', {
    url: '/profileViewStats',
    templateUrl: 'templates/ViewMyStats/profileViewStats.html',
    controller: 'ProfileViewStatsCtrl'
  
  })
  .state('withdrawCaloryAndCash', {
    url: '/withdrawCaloryAndCash',
        params :{
          showCashAndCalory : null  
        },
    templateUrl: 'templates/ViewMyStats/withdrawCaloryAndCash.html',
    controller: 'WithdrawCaloryAndCashCtrl'
  
  })
  
  .state('contribution', {
    url: '/contribution',
    templateUrl: 'templates/contribution.html',
    controller: 'contributionCtrl',
    params:{
        id:null
    }
  
  })
  .state('thanksAfterContribution', {
    url: '/thanksAfterContribution',
    templateUrl: 'templates/thanks_after_contribution.html',
    controller: 'thanksAfterContributionCtrl',
    params:{
        id:null
    }
  
  })
  .state('question1', {
    url: '/question1',
    templateUrl: 'templates/question.html',
    controller: 'question1Ctrl'
  
  })
  .state('question2', {
    url: '/question2',
    templateUrl: 'templates/question2.html',
    controller: 'question2Ctrl',
    params:{
        obj:null
    }
  
  })
  .state('question3', {
    url: '/question3',
    templateUrl: 'templates/question3.html',
    controller: 'question3Ctrl',
    params:{
        obj:null
    }
  
  })
  .state('question4', {
    url: '/question4',
    templateUrl: 'templates/question4.html',
    controller: 'question4Ctrl',
    params:{
        obj:null
    }
  
  })
  .state('question5', {
    url: '/question5',
    templateUrl: 'templates/question5.html',
    controller: 'question5Ctrl',
    params:{
        obj:null
    }
  
  })
  .state('question6', {
    url: '/question6',
    templateUrl: 'templates/question6.html',
    controller: 'question6Ctrl',
  })
  .state('question7', {
    url: '/question7',
    templateUrl: 'templates/question7.html',
    controller: 'question7Ctrl'
  })
  .state('question8', {
    url: '/question8',
    templateUrl: 'templates/question8.html',
    controller: 'question8Ctrl'
  })
  .state('updateCampaign_video', {
    url: '/updateCampaign',
    templateUrl: 'templates/updatecampaign.html',
    controller: 'UpdateCampaignCtrl'
  })
  .state('account_settings', {
    url: '/account&settings',
    templateUrl: 'templates/account.html',
    controller: 'accountSettingsCtrl'
  }) 
  .state('account_settings_end_cnf_campaign', {
    url: '/account&settings_end_cnf_campaign',
    templateUrl: 'templates/endConfirmCampaign.html',
    controller: 'accountSettingsendcampaignCtrl'
  })
  .state('endCampaignProfile', {
    url: '/endCampaignProfile',
    templateUrl: 'templates/Profile/profile-endcampaign.html',
    controller: 'profile-endcampaignCtrl'
  })
  .state('contactAdmin', {
    url: '/contactAdmin',
    templateUrl: 'templates/contactAdmin.html',
    controller: 'contactAdminCtrl'
  })
  .state('myContribution', {
    url: '/myContribution',
   
    templateUrl: 'templates/myContribution.html',
    controller: 'myContributionCtrl'
    
  })
  
  .state('myContributionUserProfile', {
    url: '/myContributionUserProfile',
    templateUrl: 'templates/Profile/myContributionUserProfile.html',
    controller: 'myContributionUserProfileCtrl',
     params:{
      id:null
    }
  })
  .state('addFund', {
    url: '/addFund',
    templateUrl: 'templates/addFund/addFund.html',
    controller: 'addFundCtrl'
     
  })
  .state('congrats_videoupload', {
    url: '/congrats_videoupload',
    templateUrl: 'templates/congrats_videoupload.html',
    controller: 'CongratsVideoUploadCtrl'
     
  })
  .state('questions', {
    url: '/questions',
    templateUrl: 'templates/question_1.html',
    controller: 'questionListsCtrl'
  
  })
  
  .state('sponsorsAcquired', {
    url: '/sponsorsAcquired',
    templateUrl: 'templates/ViewMyStats/sponsorsAcquired.html',
    controller: 'sponsorsAcquiredCtrl'
  
  })

   .state('mySponsorsUserProfile', {
    url: '/mySponsorsUserProfile',
    templateUrl: 'templates/Profile/mySponsorsUserProfile.html',
    controller: 'mySponsorsUserProfileCtrl',
     params:{
      id:null
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/globalChat');
});

/*
 * 
 * .state('workout', {
    url: '/workout/:workout',
    abstract: true,
    cache: false,
    template: '<qf-workout></qf-workout>'
  })

  .state('workout.start', {
    url: '/start',
    views: {
      'workout': {
        template: '<qf-workout-start></qf-workout-start>'
      }
    }
  })
 */