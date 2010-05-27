(function($) {
    $.fn.extend({
        instantValidate: function(options) {
            var numErrors = 0;
            var defaults = {
                url:'',
                vfParam:'vf',
                display: 'inline',  // or top
                errorBox: '.errors'
            };
            var settings = $.extend(defaults, options);
            return this.each(function() {
                var form = $(this);
                $(this).find('input[type=text]').each(function() {

                    var fieldContainer = $(this).parent();
                    var field = $(this).clone(true);
                    field.addClass('instantValidate');
                    $(this).remove();

                    var fieldId = $(field).attr('id');

                    var newFieldContainer = $("<div>").addClass('error-' + fieldId).append(field);

                    var errorMsg = $("<div>").addClass('error-msg-' + fieldId).html('&nbsp;').hide();
                    $(field).after(errorMsg);
                    var bullet = $('<span>').css('display', 'inline').addClass('instantValidate-icon').html('&nbsp;').hide();
                    $(field).after(bullet);
                    fieldContainer.append(newFieldContainer);

                    // set up error box
                    if (settings.display == 'top') {
                        var errorList = $('ul').addClass('instantValidate-error-list');
                        $(settings.errorBox).append(errorList);
                    }
                    $(field).blur(function() {

                        var formParams = $(form).serialize();
                        formParams += '&' + settings.vfParam + '=' + fieldId;
                        $.post(settings.url, formParams, function(data) {
                            if (settings.display == 'inline') {
                                showErrorInline(data, fieldId);
                            }else{
                                showErrorTop(data, fieldId);
                            }
                        }, 'json');
                        
                    });
                })
            });

            function showErrorInline(errors, field) {

                if (errors[field]) {
                    $('.error-msg-' + field).html(errors[field]).show();
                    $('.error-' + field).addClass('instantValidate-error');
                    $('.error-' + field + ' span').hide();
                } else {
                    $('.error-' + field + ' span').show();//css('display', 'inline');
                    $('.error-msg-' + field).html('&nbsp;').hide();
                    $('.error-' + field).removeClass('instantValidate-error');

                }
            }

            function showErrorTop(errors, field) {
                if (errors[field]) {
                    // need to see if error already exists
                    var showError = true;
                    $(settings.errorBox).find('li').each(function() {
                        if ($(this).attr('id') == 'list-error-'+field) {
                            showError = false;
                        }
                    });

                    if (showError) {
                        numErrors++;
                        $(settings.errorBox).append($('<li>').attr('id', 'list-error-'+field).html(errors[field]));
                        $('.error-' + field).addClass('instantValidate-error');
                        $('.error-' + field + ' span').hide();
                    }
                    $(settings.errorBox).show();
                }else{
                    var li = $('#list-error-' + field);
                    if (li.length) {
                        numErrors--;
                    }
                    $(li).remove();
                    $('.error-' + field).removeClass('instantValidate-error');
                    $('.error-' + field + ' span').show();//css('display', 'inline');

                    if (numErrors == 0) {
                        $(settings.errorBox).hide();   

                    }
                }

            }
        }
    });
})(jQuery)