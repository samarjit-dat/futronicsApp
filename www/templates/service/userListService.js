futronics.service("UserListService", function($http,$q,Loader, $localstorage,URL,$rootScope) {
  this.userListOnLoad = function(data){
      var defered=$q.defer();
       Loader.showLoading();
    return $http({
            method: "POST",
            url: URL.BASE+"/userList",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){ 
             Loader.hideLoading();
            if(response.data.status == 2){
              
                if($rootScope.currentState == "globalChat"  && $rootScope.noMore++ < 1){
                     var loadMoreId = document.getElementById('loadMore');
                     loadMoreId.style.display = 'none';
                     toastr.error('No more data available');
                }
               
               
            }
            defered.resolve(response);
            return defered.promise; 
        },function(error){
            defered.reject(error);
        });
        
    };
});

futronics.service("StorageService", function($rootScope, $localstorage,IMAGE) {
    this.storage=function(){
        
            if(localStorage.getItem('userInfo')!==null){
                
               // alert('storage');
            $rootScope.user_id='';
            $rootScope.noImage=IMAGE.BASE_IMAGE;
            $rootScope.user=JSON.parse(localStorage.getItem('userInfo'));
                if($rootScope.user.userInfo.result[0].user_id!=null || $rootScope.user.userInfo.result[0].user_id !=''){
                    $rootScope.user_id=$rootScope.user.userInfo.result[0].user_id;
                     $rootScope.start_date=$rootScope.user.userInfo.result[0].add_date;
                    //console.log($rootScope.user_id);
                     $rootScope.walletValue=$rootScope.user.userInfo.result.wallet;
                     //alert($rootScope.walletValue);
                     $rootScope.checkloginuserornot= $rootScope.user_id;
                    // if($rootScope.user.userInfo.result.campaign.length!=0){
                    //     $rootScope.goal=$rootScope.user.userInfo.result.campaign[0].proposed_weight;
                    //     $rootScope.currentWeight=$rootScope.user.userInfo.result.campaign[0].current_weight;
                    //     $rootScope.campaign_status=$rootScope.user.userInfo.result.campaign[0].campaign_status;
                        
                    // }

                    /* 31.03 */
                    if($rootScope.user.userInfo.result.campaign.length!=0){
                        $rootScope.campaign_datetime=$rootScope.user.userInfo.result.campaign[0].campaign_datetime;
                        $rootScope.campaign_date=$rootScope.campaign_datetime.split(' ');
                        $rootScope.goal=$rootScope.user.userInfo.result.campaign[0].proposed_weight;
                        $rootScope.currentWeight=$rootScope.user.userInfo.result.campaign[0].current_weight;
                        $rootScope.campaign_status=$rootScope.user.userInfo.result.campaign[0].campaign_status;
                        $rootScope.runningCampaign_id=$rootScope.user.userInfo.result.campaign[0].campaign_id;
                        
                    }
                  
                    if($rootScope.user.userInfo.result.profile_videos.length>0){
                        
                        $rootScope.profile_complete_show_progress='1';
                       if(localStorage.getItem('actualState')){
                        var _state=localStorage.getItem('actualState');
                         
                        
                            if( (_state=='upload-video') ){
                               
                               // $rootScope.referState=1;
                                localStorage.setItem("refrstate",1);
                               // alert($rootScope.referState+"actual")
                            }else if((_state=='questions')) {
                               // $rootScope.referState=2;
                             
                                 localStorage.setItem("refrstate",2);
                                
                            }else if((_state=='campaignBrowse') || (_state=='contribution') 
                            ||  (_state=='thanksAfterContribution') ){
                                   
                                 localStorage.setItem("refrstate",3);
                            }else{
                                
                                if($rootScope.user.userInfo.result.campaign.length!=0){
                                    if($rootScope.campaign_status==0){
                                      //  $rootScope.referState=3; 
                                         localStorage.setItem("refrstate",3);
                                       // alert($rootScope.referState+"actual")
                                    }else if((_state=='upload-video') && ($rootScope.campaign_status==1)){
                                        //$rootScope.referState=1;
                                         localStorage.setItem("refrstate",1);
                                      
                                    }else{
                                            if(localStorage.getItem('actualState')){
                                            var _stateSub = localStorage.getItem('actualState');
                                            if(_stateSub == 2){
                                                localStorage.setItem("refrstate",2);
                                            }
                                            if(_stateSub == 1) {
                                                localStorage.setItem("refrstate",1);
                                            }
                                            }else{
                                                localStorage.setItem("refrstate",3);
                                            }
                                      
                                    }
                                }else{
                                     localStorage.setItem("refrstate",3);
                                }
                            }
                        }
                        if(localStorage.getItem('currentSate')){
                           
                            var _state=localStorage.getItem('currentSate');
                           
                            if( _state=='upload-video' ){
                               
                               // $rootScope.referState=1;
                                 localStorage.setItem("refrstate",1);
                            }else if((_state=='questions') ) {
                                //$rootScope.referState=2;
                              
                                 localStorage.setItem("refrstate",2);
                            }else if((_state=='campaignBrowse') || (_state=='contribution') 
                            ||  (_state=='thanksAfterContribution') ){
                                 if(localStorage.getItem('actualState')){
                                    var _stateSub = localStorage.getItem('actualState');
                                    if(_stateSub == 2){
                                        localStorage.setItem("refrstate",2);
                                    }
                                    if(_stateSub == 1) {
                                         localStorage.setItem("refrstate",1);
                                    }
                                 }else{
                                    localStorage.setItem("refrstate",3);
                                 }
                            }else{
                                
                                if(localStorage.getItem('actualState')){
                                   
                                    var current_state=localStorage.getItem('actualState');
                                    
                                 }
                                 if($rootScope.user.userInfo.result.campaign.length!=0){
                                    if($rootScope.campaign_status==0){
                                       // $rootScope.referState=3; 
                                         localStorage.setItem("refrstate",3);
                                    }else if((current_state=='upload-video') && ($rootScope.campaign_status==1)){
                                       // $rootScope.referState=1;
                                         localStorage.setItem("refrstate",1);
                                    }else{
                                       // $rootScope.referState=2;
                                            if(localStorage.getItem('actualState')){
                                            var _stateSub = localStorage.getItem('actualState');
                                            if(_stateSub == 2){
                                                localStorage.setItem("refrstate",2);
                                            }
                                            if(_stateSub == 1) {
                                                localStorage.setItem("refrstate",1);
                                            }
                                            }else{
                                                localStorage.setItem("refrstate",3);
                                            }
                                    }
                                }else{
                                     localStorage.setItem("refrstate",3);
                                }
                            }
                         }
                    }else{
                       
                        if(localStorage.getItem('actualState')){
                        var _state=localStorage.getItem('actualState');
                         
                        
                            if( (_state=='upload-video') ){
                               
                               // $rootScope.referState=1;
                                localStorage.setItem("refrstate",1);
                               // alert($rootScope.referState+"actual")
                            }else if((_state=='questions')) {
                               // $rootScope.referState=2;
                             
                                 localStorage.setItem("refrstate",2);
                                
                            }else if((_state=='campaignBrowse') || (_state=='contribution') 
                            ||  (_state=='thanksAfterContribution') ){
                                   
                                 localStorage.setItem("refrstate",3);
                            }else{
                                
                                if($rootScope.user.userInfo.result.campaign.length!=0){
                                    if($rootScope.campaign_status==0){
                                      //  $rootScope.referState=3; 
                                         localStorage.setItem("refrstate",3);
                                       // alert($rootScope.referState+"actual")
                                    }else if((_state=='upload-video') && ($rootScope.campaign_status==1)){
                                        //$rootScope.referState=1;
                                         localStorage.setItem("refrstate",1);
                                      
                                    }else{
                                            if(localStorage.getItem('actualState')){
                                            var _stateSub = localStorage.getItem('actualState');
                                            if(_stateSub == 2){
                                                localStorage.setItem("refrstate",2);
                                            }
                                            if(_stateSub == 1) {
                                                localStorage.setItem("refrstate",1);
                                            }
                                            }else{
                                                localStorage.setItem("refrstate",3);
                                            }
                                      
                                    }
                                }else{
                                     localStorage.setItem("refrstate",3);
                                }
                            }
                        }
                        if(localStorage.getItem('currentSate')){
                           
                            var _state=localStorage.getItem('currentSate');
                           
                            if( _state=='upload-video' ){
                               
                               // $rootScope.referState=1;
                                 localStorage.setItem("refrstate",1);
                            }else if((_state=='questions') ) {
                                //$rootScope.referState=2;
                              
                                 localStorage.setItem("refrstate",2);
                            }else if((_state=='campaignBrowse') || (_state=='contribution') 
                            ||  (_state=='thanksAfterContribution') ){
                                 if(localStorage.getItem('actualState')){
                                    var _stateSub = localStorage.getItem('actualState');
                                    if(_stateSub == 2){
                                        localStorage.setItem("refrstate",2);
                                    }
                                    if(_stateSub == 1) {
                                         localStorage.setItem("refrstate",1);
                                    }
                                 }else{
                                    localStorage.setItem("refrstate",3);
                                 }
                            }else{
                                
                                if(localStorage.getItem('actualState')){
                                   
                                    var current_state=localStorage.getItem('actualState');
                                    
                                 }
                                 if($rootScope.user.userInfo.result.campaign.length!=0){
                                    if($rootScope.campaign_status==0){
                                       // $rootScope.referState=3; 
                                         localStorage.setItem("refrstate",3);
                                    }else if((current_state=='upload-video') && ($rootScope.campaign_status==1)){
                                       // $rootScope.referState=1;
                                         localStorage.setItem("refrstate",1);
                                    }else{
                                       // $rootScope.referState=2;
                                            if(localStorage.getItem('actualState')){
                                            var _stateSub = localStorage.getItem('actualState');
                                            if(_stateSub == 2){
                                                localStorage.setItem("refrstate",2);
                                            }
                                            if(_stateSub == 1) {
                                                localStorage.setItem("refrstate",1);
                                            }
                                            }else{
                                                localStorage.setItem("refrstate",3);
                                            }
                                    }
                                }else{
                                     localStorage.setItem("refrstate",3);
                                }
                            }
                         }
                        $rootScope.profile_complete_show_progress='0';
                        
                    }

                }
            $rootScope.check='1';
            $rootScope.user_details=JSON.parse(localStorage.getItem('userInfo'));
            //console.log( '$scope.wallet');
            //console.log($rootScope.user_details);
            $rootScope.userId=$rootScope.user_details.userInfo.result[0].user_id;
            $rootScope.wallet=$rootScope.user_details.userInfo.result.wallet;
            $rootScope.total_campaign=$rootScope.user_details.userInfo.result.total_campaign;
            //$rootScope.total_progress=$rootScope.user_details.userInfo.result.campaign[0].progress_percentage;
           //console.log($rootScope.user_details);
            $rootScope.username=$rootScope.user_details.userInfo.result[0].username;
            /* *****profile Controller Line No 27 **************** */
             $rootScope.other_user_details=JSON.parse(localStorage.getItem('userInfo'));
                //console.log('other');
                //console.log($rootScope.other_user_details.userInfo.result.profile_videos);
                //alert($rootScope.other_user_details.userInfo.result.profile_videos.length);
                if($rootScope.other_user_details.userInfo.result.profile_videos.length===0){
                    $rootScope.unCompleteCampaign='1';
                    //alert('blank viedoe');
                }else if(localStorage.getItem('endcampaign') && localStorage.getItem('campaignCompleteOrNot') ){
                  
                     $rootScope.unCompleteCampaign='1';
                }else{
                   $rootScope.unCompleteCampaign='0'; 
                }
                //console.log($rootScope.other_user_details);
            /* *****profile Controller 107**************** */
            
            $rootScope.my_details_other_profile=$localstorage.getObject('userInfo');
            //console.log('$rootScope.my_details_other_profile');
            //console.log($rootScope.my_details_other_profile);
            /*** profile End Campaign ****************/
            $rootScope.my_details='';
	    $rootScope.my_details=JSON.parse(localStorage.getItem('userInfo'));
            /********************* MY CONTRIBUTIONS ************************/ 
            $rootScope.contributions=[];
            //$rootScope.contributions=JSON.parse(localStorage.getItem('single_user'));
                for(var i=0;i<$rootScope.other_user_details.userInfo.result.contributor.length;i++){

               
               $rootScope.contributions.push($rootScope.other_user_details.userInfo.result.contributor[i]);
                //console.log('$rootScope.contributions');
                //console.log($rootScope.contributions);
            }
            
            /********************* MY CONTRIBUTIONS ************************/ 
              /*** profile End Campaign ***************/
        if($rootScope.user.userInfo.result[0].user_id==null || $rootScope.user.userInfo.result[0].user_id ==''){
            //alert('checkblur');
            $rootScope.profileImg_blur = angular.element( document.querySelector( '#profileMainImage' ) );
            $rootScope.profileImg_blur.addClass('blur_image_and_campaign');
        }
//        if($rootScope.user.userInfo.result.campaign.length>0){
//            $rootScope.campaign_status=$rootScope.user.userInfo.result.campaign[0].campaign_status;
//        }
//        }else{
//            $rootScope.campaign_status=0;
//        }
        
        }else{
            $rootScope.user_id='';
            $rootScope.userId='';
        }
    };
});

futronics.service('AllUser_MyContribution',function($rootScope, $localstorage){
    this.storage=function(){
      $rootScope.allUser=[];
      $rootScope.all_user_details=JSON.parse(localStorage.getItem('allUserDetails'));
      //console.log('campaign');
      //console.log( $rootScope.all_user_details);
      for(var i=0;i<$rootScope.all_user_details.length;i++){
           if($rootScope.all_user_details[i].campaign.length>0 && $rootScope.all_user_details[i].profile_videos.length>0){ 
               if($rootScope.all_user_details[i].campaign[0].campaign_status==='1'){
                $rootScope.allUser.push($rootScope.all_user_details[i]);
                //localStorage.removeItem('campaignCompleteOrNot');
                console.log('support others');
                console.log($rootScope.allUser);
           }
        }
      }
    };
});
futronics.service('endcampaign',function($http,$q, $localstorage,URL,$rootScope){
    this.userEndCampaign = function(data){

        var endCampaignUrl;
        if($rootScope.isMaintain == 'false'){
             endCampaignUrl = "/endtheCampain";
        }else {
             endCampaignUrl = "/endtheCampainMaintence";
        }
        var defered=$q.defer();
    
        return $http({
            method: "POST",
            url: URL.BASE+endCampaignUrl,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:data
        }).then(function(response){ 
            var user_info=JSON.parse(localStorage.getItem("userInfo"));
            user_info.userInfo.result.campaign[0].campaign_status="0";
            var update_userInfo=JSON.stringify(user_info);
            localStorage.setItem("userInfo",update_userInfo);
            
            var all_user_details=JSON.parse(localStorage.getItem("allUserDetails"));
            for(var i=0;i<all_user_details.length;i++){
            if(all_user_details[i].campaign.length>0){
                if(all_user_details[i].campaign[0].user_id==user_info.userInfo.result[0].user_id){
                    all_user_details[i].campaign[0].campaign_status="0";
                    var updated_allUserDetails=JSON.stringify(all_user_details);
                    localStorage.setItem("allUserDetails",updated_allUserDetails);
                }
              }
           }
            defered.resolve(response);
            return defered.promise; 
        },function(error){
            defered.reject(error);
        });
        
    };
});




 