jQuery(document).ready(function() {

              // credits (custom regex validation)
              // https://stackoverflow.com/questions/15482523/jquery-validate-adding-dynamic-rules-with-messages
              // https://stackoverflow.com/questions/280759/jquery-validate-how-to-add-a-rule-for-regular-expression-validation
              jQuery.validator.addMethod(
                      "regex",
                      function(value, element, regexp) {
                          var re = new RegExp(regexp);
                          return this.optional(element) || re.test(value);
                      },
                      "Input value contains some invalid characters"
              );

              //jQuery validation plugin -- basic setup
              //credits: https://www.sitepoint.com/basic-jquery-form-validation-tutorial/
              jQuery("form[name='this-form']").validate({

                // credits: https://stackoverflow.com/questions/9392133/when-form-is-validated-how-to-scroll-to-the-first-error-instead-of-jumping
                invalidHandler: function(form, validator) {
                    if (!validator.numberOfInvalids())
                        return;
                    jQuery('html, body').animate({
                        scrollTop: jQuery(validator.errorList[0].element).offset().top - 100
                    }, 2000);
                },
                rules: {
__PLACEHOLDER_1__                  
                },
                submitHandler: function(form) {
                  form.submit();
                }
              });   // end of jQuery validate block


});   // end of jQuery document ready block
