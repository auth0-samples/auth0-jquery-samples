$(document).ready(function() {
    var lock = new Auth0Lock(
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN
    );

    var userProfile;

    var hash = lock.parseHash();
    if (hash) {
        if (hash.error) {
            console.log("There was an error logging in", hash.error);
        }
        else {
            lock.getProfile(hash.id_token, function (err, profile) {
                if (err) {
                    console.log('Cannot get user', err);
                    return;
                }
                // Save the JWT token.
                localStorage.setItem('id_token', hash.id_token);
                var idToken = hash.id_token;
                console.log("Auth0 token", idToken);
                var delegationOptions = {
                    id_token: idToken,
                    api: API_TYPE
                };
                lock.getClient().getDelegationToken(delegationOptions,
                    function(err, thirdPartyApiToken) {
                        if (err) {
                            console.log("There was an error getting a delegation token: " + JSON.stringify(err));
                        } else {
                            localStorage.setItem('thirdPartyApiToken', thirdPartyApiToken.id_token);
                            console.log("Third party token", thirdPartyApiToken.id_token);
                        }
                    });
                // Save the profile
                userProfile = profile;

                $('.login-box').hide();
                $('.logged-in-box').show();
                $('.name').text(profile.name);
            });
        }
    }

    $('.btn-login').click(function(e) {
      e.preventDefault();
      lock.show();
    });


    $('.btn-api').click(function(e) {
        // Just call your API here. The header will be sent
    })


});
