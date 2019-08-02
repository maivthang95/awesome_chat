/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */
function showRegisterForm() {
    $('.loginBox').fadeOut('fast', function() {
      $('.registerBox').fadeIn('fast');
      $('.login-footer').fadeOut('fast', function() {
        $('.register-footer').fadeIn('fast');
      });
      $('.modal-title').html('Đăng ký tài khoản');
    });
    $('.error').removeClass('alert alert-danger').html('');
  
  }
  
  function showLoginForm() {
    $('#loginModal .registerBox').fadeOut('fast', function() {
      $('.loginBox').fadeIn('fast');
      $('.register-footer').fadeOut('fast', function() {
        $('.login-footer').fadeIn('fast');
      });
  
      $('.modal-title').html('Đăng nhập');
    });
    $('.error').removeClass('alert alert-danger').html('');
  }
  
  function openLoginModal() {
    setTimeout(function() {
      showLoginForm();
      $('#loginModal').modal('show');
    }, 230);
  }
  
  function openRegisterModal() {
    setTimeout(function() {
      showRegisterForm();
      $('#loginModal').modal('show');
    }, 230);
  }
