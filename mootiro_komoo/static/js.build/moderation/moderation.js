$(function(){function n(n){var r=dutils.urls.resolve("report_content_box");$.ajax({url:r,context:$("#root"),success:function(r,i,s){$(this).append($(r));var o=$("#report-content-form");o.submit(function(r){if(!$("input[type=radio]:checked",o).val()){var i=$("#report-content-radio-container");return i.addClass("error"),$("input[type=radio]",o).change(function(e){i.removeClass("error")}),!1}var s=$(this).attr("action"),u=$(this).serialize();return $.ajax({url:s,cache:!1,data:u,dataType:"json",type:"POST",success:function(r,i,o){if(r.error){var a=JSON.stringify({script:e,reference:"getReportContentBox#responseError",info:"An error occurred while trying to report a content.",ajaxUrl:s,ajaxPostData:u,jqXHR:o});unexpectedError(a)}else n.addClass("disabled"),flash(r.message),t.dialog("close")},error:function(t,n,r){var i=JSON.stringify({script:e,reference:"getReportContentBox#ajaxError",info:"An error occurred while trying to report a content.",ajaxUrl:s,ajaxPostData:u,jqXHR:t});unexpectedError(i)}}),!1}),$("#report-content-cancel-btn").click(function(e){return t.dialog("close"),o.clearForm(),!1}),openReportContentDialog(n,!0)},error:function(t,n,i){var s=JSON.stringify({script:e,reference:"getReportContentBox#ajaxError",info:"An error occurred while trying to get the abuse report form.",ajaxUrl:r,ajaxPostData:"none",jqXHR:t});unexpectedError(s)}})}function i(n){var r=dutils.urls.resolve("deletion_request_box");$.ajax({url:r,context:$("#root"),success:function(r,i,s){$(this).append($(r));var o=$("#deletion-request-form");o.submit(function(r){var i=$(this).attr("action"),s=$(this).serialize();return $.ajax({url:i,cache:!1,data:s,dataType:"json",type:"POST",success:function(r,o,u){if(r.error){var a=JSON.stringify({script:e,reference:"getDeletionRequestBox#responseError",info:"An error occurred while trying to send a deletion request.",ajaxUrl:i,ajaxPostData:s,jqXHR:u});unexpectedError(a)}else n.addClass("disabled"),flash(gettext("Your request was successfully sent")),t.dialog("close")},error:function(t,n,r){var o=JSON.stringify({script:e,reference:"getDeletionRequestBox#ajaxError",info:"An error occurred while trying to send a deletion request.",ajaxUrl:i,ajaxPostData:s,jqXHR:t});unexpectedError(o)}}),!1}),$("#deletion-request-cancel-btn").click(function(e){return t.dialog("close"),o.clearForm(),!1}),openDeletionRequestDialog(n,!0)},error:function(t,n,i){var s=JSON.stringify({script:e,reference:"getDeletionRequestBox#ajaxError",info:"An error occurred while trying to get the deletion request form.",ajaxUrl:r,ajaxPostData:"none",jqXHR:t});unexpectedError(s)}})}var e="moderation/moderation.js",t;openReportContentDialog=function(e,r){if(e.hasClass("disabled"))return;var i=$("#report-content-box"),s=e.attr("data-app-label"),o=e.attr("data-model-name"),u=e.attr("data-id");if(i.length!=0){$("#report-content-form").attr({action:dutils.urls.resolve("moderation_report",{app_label:s,model_name:o,obj_id:u})});var a=$("#report-content-form");a.clearForm(),t=i.dialog({title:gettext("Report Abuse"),width:450,modal:!0,resizable:!1,draggable:!1})}else r||n(e)};var r=$(".report-content-btn");$.each(r,function(e,t){var n=$(t);n.bind("click",function(e){return openReportContentDialog(n),!1})}),openDeletionRequestDialog=function(e,n){var r=$("#deletion-request-box"),s=e.attr("data-app-label"),o=e.attr("data-model-name"),u=e.attr("data-id");if(r.length!=0){$("#deletion-request-form",r).attr({action:dutils.urls.resolve("moderation_delete",{app_label:s,model_name:o,obj_id:u})});var a=$("#deletion-request-form");a.clearForm(),$("input[name=action]",a).val("request"),t=r.dialog({title:gettext("Deletion Request"),width:450,modal:!0,resizable:!1,draggable:!1})}else n||i(e)},deleteContent=function(t,n){if(t.hasClass("disabled"))return;var r=t.attr("data-app-label"),i=t.attr("data-model-name"),s=t.attr("data-id"),o=dutils.urls.resolve("moderation_delete",{app_label:r,model_name:i,obj_id:s}),u={confirmed:n||!1};$.ajax({type:"POST",url:o,data:u,success:function(n,r,i){if(n.success=="true")if(n.next=="confirmation")confirmationMessage(gettext("Delete"),gettext("Do you really want to delete this content?"),"",function(e){e=="yes"&&deleteContent(t,!0)});else if(n.next=="request")openDeletionRequestDialog(t);else if(n.next=="showDeleteFeedback"){t.addClass("disabled"),flash(gettext("The content was successfully deleted"),-1);var s=$("#main-content");$("#content").height(s.height()),s.fadeOut(),setTimeout(function(){window.location.href=dutils.urls.resolve("root")},3e3)}else n.next=="showRequestFeedback"&&(t.addClass("disabled"),flash(gettext("Your request was successfully sent")));else{var a=JSON.stringify({script:e,reference:"deleteContent#responseError",info:"An error occurred while trying to delete a content.",ajaxUrl:o,ajaxPostData:u,jqXHR:i});unexpectedError(a)}},error:function(t,n,r){var i=JSON.stringify({script:e,reference:"deleteContent#ajaxError",info:"An error occurred while trying to delete a content.",ajaxUrl:o,ajaxPostData:u,jqXHR:t});unexpectedError(i)}})};var s=$(".delete-content-btn");$.each(s,function(e,t){var n=$(t);n.bind("click",function(e){return deleteContent(n),!1})})});