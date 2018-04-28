jQuery(document).ready(function(){


  // Add body-small class if window less than 768px
    if (jQuery(this).width() < 769) {
        jQuery('body').addClass('body-small')
    } else {
        jQuery('body').removeClass('body-small')
    }    
 	jQuery('#side-menu').metisMenu();

 	jQuery(document).on('click','#xxxx',function(){
 		jQuery('#side-menu').metisMenu();
 	});
 	
    // Open close right sidebar
   /* jQuery('.right-sidebar-toggle').click(function () {
        jQuery('#right-sidebar').toggleClass('sidebar-open');
    });*/ 
/*  jQuery(document).on('click','.navbar-minimalize',function(e){ 
      	jQuery("body").toggleClass("mini-navbar");  
  });*/
        
    // Minimalize menu
/*    jQuery('.navbar-minimalize').click(function () {
        jQuery("body").toggleClass("mini-navbar");
        SmoothlyMenu();

    });*/
	
	// Date Initialization
	if(jQuery('.date').length){
		    jQuery('.date').datepicker();
		}
		
	
	
	//Select simple
	if(jQuery('.simp-select').length){
		jQuery('.simp-select').selectize();
	}
	
	
	//comma seprated input
	if(jQuery('.input-tags').length){
		jQuery('.input-tags').selectize({
			persist: false,
			createOnBlur: true,
			create: true
		});
	}
	
	//dropdown
	var options = [];
	jQuery( '.dropdown-menu a' ).on( 'click', function( event ) {
	   var jQuerytarget = jQuery( event.currentTarget ),
		   val = jQuerytarget.attr( 'data-value' ),
		   jQueryinp = jQuerytarget.find( 'input' ),
		   idx;

	   if ( ( idx = options.indexOf( val ) ) > -1 ) {
		  options.splice( idx, 1 );
		  setTimeout( function() { jQueryinp.prop( 'checked', false ) }, 0);
	   } else {
		  options.push( val );
		  setTimeout( function() { jQueryinp.prop( 'checked', true ) }, 0);
	   }

	   jQuery( event.target ).blur();
	   return false;
	});
	
	//Add Competitors div
	jQuery('.addnewcomptr').click(function(){
		jQuery('.add-competitor').append("<div class='col-sm-6'><div class='form-group'><label>Competitor's Name</label><input type='text' placeholder='Enter Competitor Name' class='form-control' /></div></div><div class='col-sm-6'><div class='form-group'><label>Competitors Industry</label><input type='text' placeholder='Enter Competitors Industry' class='form-control' /></div></div>");
	});
});


// Minimalize menu when screen is less than 768px
jQuery(window).bind("resize", function () {
    if (jQuery(this).width() < 769) {
        jQuery('body').addClass('body-small')
    } else {
        jQuery('body').removeClass('body-small')
    }
});


// For demo purpose - animation css script
function animationHover(element, animation) {
    element = jQuery(element);
    element.hover(
        function () {
            element.addClass('animated ' + animation);
        },
        function () {
            //wait for animation to finish before removing classes
            window.setTimeout(function () {
                element.removeClass('animated ' + animation);
						}, 1000);
        });
}

/*function SmoothlyMenu() {
    if (!jQuery('body').hasClass('mini-navbar') || jQuery('body').hasClass('body-small')) {
        // Hide menu in order to smoothly turn on when maximize menu
        jQuery('#side-menu').hide();
        // For smoothly turn on menu
        setTimeout(
            function () {
                jQuery('#side-menu').fadeIn(500);
            }, 100);
    } else if (jQuery('body').hasClass('fixed-sidebar')) {
        jQuery('#side-menu').hide();
        setTimeout(
            function () {
                jQuery('#side-menu').fadeIn(500);
            }, 300);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        jQuery('#side-menu').removeAttr('style');
    }
}*/
//Progress bar form
jQuery(function(){
 jQuery('.btn-circle').on('click',function(){
   jQuery('.btn-circle.btn-info').removeClass('btn-info').addClass('btn-default');
   jQuery(this).addClass('btn-info').removeClass('btn-default').blur();
 });

 jQuery('.next-step, .prev-step').on('click', function (e){
   var jQueryactiveTab = jQuery('.tab-pane.active');

		

   if ( jQuery(e.target).hasClass('next-step') )
   {
		var nextTab = jQueryactiveTab.next('.tab-pane').attr('id');
		jQuery('[href="#'+ nextTab +'"]').addClass('btn-info').removeClass('btn-default');
		jQuery('[href="#'+ nextTab +'"]').tab('show');
	  
		var res = nextTab.substring(4, 5);//res =1
		//alert("nextTab::"+nextTab);
		res = parseInt(res)-1;//res=2		
		var prevTab = "menu"+res+"";
		//alert("prevTab::"+prevTab);
		
		jQuery('.process-step.bs-wizard-step.'+nextTab+'').addClass('active').removeClass('disabled');
		jQuery('.process-step.bs-wizard-step.'+prevTab+'').addClass('complete').removeClass('active');
		
		
   }
   else
   {
		var prevTab = jQueryactiveTab.prev('.tab-pane').attr('id');
		jQuery('[href="#'+ prevTab +'"]').addClass('btn-info').removeClass('btn-default');
		jQuery('[href="#'+ prevTab +'"]').tab('show');
		
		var res = prevTab.substring(4, 5);//res =1
		//alert("prevTab::"+prevTab);
		res = parseInt(res)+1;//res=2		
		var nextTab = "menu"+res+"";
		//alert("nextTab::"+nextTab);
		
		jQuery('.process-step.bs-wizard-step.'+nextTab+'').addClass('disabled').removeClass('active');
		jQuery('.process-step.bs-wizard-step.'+prevTab+'').addClass('active').removeClass('complete');
   }
 });
});
// file upload
;( function ( document, window, index )
{
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});
}( document, window, 0 ));
