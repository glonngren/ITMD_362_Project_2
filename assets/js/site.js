(function(){
  // Browser sanity check:
  if (!('querySelector' in document && 'addEventListener' in document)) {
    // Old, old browser. Say buh-bye
    // console.log('Old browser');
    return;
  }

  // Library of comparison functions
  //
  // Unlike the raw operators these encapsulate, functions
  // can be passed around like any other value into other
  // functions.
  function eq(value, condition) {
    return value === condition;
  }
  function gt(value, condition) {
    return value > condition;
  }
  function gte(value, condition) {
    return value >= condition;
  }
  function lt(value, condition) {
    return value < condition;
  }
  function lte(value, condition) {
    return value <= condition;
  }

  // Data cleanup functions
  function clean_nonnumbers(value) {
    // returns value with all non-digits removed
    return value.replace(/\D/g, '');
  }
  function clean_whitespace(value) {
    // returns value with all whitespace characters removed
    return value.replace(/\s/g, '');
  }

  // Phone-specific santizier functions
  function strip_us_country_code(value) {
    return value.replace(/^1/, '');
  }

  // All purpose validate function. It takes a value,
  // along with either a regular expression pattern or
  // a simple function -- like the comparison functions
  // above -- and a condition. JavaScript doesn't char
  // if a function is called with more or fewer arguments
  // than described in the function definition, so it's
  // no problem at all to leave off the `condition`
  // argument when calling a check that's a regular expression
  function validate(value, check, condition) {
    if (eq(typeof(check.test), 'function')) {
      // Handle a regular expression
      return check.test(value);
    } else if (eq(typeof(check), 'function')) {
      // Handle a comparison function
      return check(value, condition);
    } else {
      return false;
    }
  }

  // Phone validity functions
  function validate_us_phone(value) {
    var phone_number = strip_us_country_code(clean_nonnumbers(value));
    return validate(phone_number.length, eq, 10);
  }

  // Email validity function
  function validate_email(value) {
    var email = clean_whitespace(value);
    return validate(email, /^[^@\s]+@[^@\s]+$/g);
  }

  // ZIP code validity function
  function validate_us_zip(value) {
    var zip = clean_nonnumbers(value);
    return validate(zip.length, eq, 5);
  }

  function save_event_info(){
    //  detect button click to save event info to local storage
    document.addEventListener('click', function(event){
      if(event.target.tagName=='A'){
        //localStorage.clear();
        var eventname = event.target.id;
        localStorage.setItem("event-id", eventname);
        localStorage.setItem("event-title", document.getElementById(eventname + "-title").innerHTML);
        localStorage.setItem("event-start-date", document.getElementById(eventname + "-start-date").innerHTML);
        localStorage.setItem("event-brief-location", document.getElementById(eventname + "-brief-location").innerHTML);
        localStorage.setItem("event-price", document.getElementById(eventname + "-price").innerHTML);
        localStorage.setItem("event-end-date", document.getElementById(eventname + "-end-date").innerHTML);
        localStorage.setItem("event-full-location", document.getElementById(eventname + "-full-location").innerHTML);
        localStorage.setItem("event-org", document.getElementById(eventname + "-org").innerHTML);
        localStorage.setItem("event-descrip", document.getElementById(eventname + "-descrip").innerHTML);
        localStorage.setItem("event-img", document.getElementById(eventname + "-img").src);
      }
    });
  }

  function set_event_info() {
      //  get all elements
      var descripPage= document.getElementById("body-description")
      if(descripPage != null){
      var eventPic = document.getElementById("descrip-img");
      var eventStartDate = document.getElementById("descrip-start-date");
      var eventTitle = document.getElementById("descrip-title");
      var eventOrg = document.getElementById("descrip-org");
      var eventBriefLocation = document.getElementById("descrip-brief-location");
      var eventPrice = document.getElementById("descrip-price");
      var eventDescrip = document.getElementById("descrip-descrip");
      var eventEndDate = document.getElementById("descrip-end-date");
      var eventFullLocation = document.getElementById("descrip-full-location");

      //  Set all elements from local storage
      try {
      eventPic.src = localStorage.getItem("event-img");
      }
      catch {
        throw "no image to set";
      }
      eventStartDate.innerHTML = localStorage.getItem("event-start-date");
      eventTitle.innerHTML = localStorage.getItem("event-title");
      eventOrg.innerHTML = localStorage.getItem("event-Org");
      eventBriefLocation.innerHTML = localStorage.getItem("event-brief-location");
      eventPrice.innerHTML = localStorage.getItem("event-price");
      eventDescrip.innerHTML = localStorage.getItem("event-descrip");
      eventEndDate.innerHTML = localStorage.getItem("event-end-date");
      eventFullLocation.innerHTML = localStorage.getItem("event-full-location");
    }

  }

  function set_event_info_signup(){
    var eventPrice = document.getElementById("event-price");
    eventPrice.innerHTML = localStorage.getItem("event-price");
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Select the necessary elements from the DOM
    /*var test = document.getElementById("meeting-your");
    console.log(test.id + "-add");*/

    //  save event info from main page and load to new page

    save_event_info();
    set_event_info();
    set_event_info_signup();




    document.addEventListener('click', function(event){
      //if(event.target.id=='number-tickets-box'){

        var numberOfTickets = document.getElementById("number-tickets-box").value;
        var totalCost = numberOfTickets*2;
        console.log(numberOfTickets);
        console.log("Total Cost: " + totalCost);
      //}
    });

/*
    var order = {};
    var location = {};
    order.form = document.querySelector('#order-form');
    order.submit_area = order.form.querySelector('#submit-area');
    order.submit_button = order.form.querySelector('#order');
    order.eh_submit_button = document.createElement('a');
    order.eh_submit_button.href = '#null';
    order.eh_submit_button.id = 'eh-submit';
    order.eh_submit_button.setAttribute('role', 'button');
    order.eh_submit_button.innerText = "Place Enhanced Order";

    // Enhance only for browsers that understand <template>
    if('content' in document.createElement('template')) {
      order.size_area = order.form.querySelector('#size-area');
      order.size_selector = order.form.querySelector('#size');
      order.eh_size_template = document.querySelector('#size-touch-template');
      // TODO: Figure out why my event listener failed on this
      order.eh_size_selector = document.importNode(order.eh_size_template.content, true);

      // Add a hidden class to the old-school select
      order.size_selector.classList.add('hidden');

      // Replace the select element with a custom, templated control
      order.size_area.appendChild(order.eh_size_selector);

      // TODO: Make this so I don't cry
      order.form.querySelector('#size-touch').addEventListener('click', function(e){
        var size = e.target.dataset.size;
        var sizes = order.size_selector.querySelectorAll('option');
        var buttons = order.size_area.querySelectorAll('a');
        console.log(e.target.dataset.size);
        // TODO: Clean up how we remove existing selected attribute
        for (var i=0; i<sizes.length; i++) {
          sizes[i].removeAttribute('selected');
          buttons[i].classList.remove('selected');
        }
        order.size_selector.querySelector('option[value="'+size+'"]').setAttribute('selected', 'selected');
        e.target.classList.add('selected');

      });

    }

    // Replace the submit button with `<a role="button">`
    order.submit_button.classList.add('hidden');
    order.submit_area.appendChild(order.eh_submit_button);

    location.zip = order.form.querySelector('#zip');
    location.city = order.form.querySelector('#city');
    location.state = order.form.querySelector('#state');

    if ('fetch' in window) {
      var zip;
      console.log("yay, this browser suppports the Fetch API");

      // TODO: Get rid of this hacky variable to track requests

      location.zip.addEventListener('keyup', function(e){
        // Validate and ensure no duplicate requests
        if(validate_us_zip(location.zip.value) && zip !== location.zip.value) {
          // fetch('http://localhost:8080/60616.js')
          zip = location.zip.value;
          fetch('http://api.zippopotam.us/us/' + location.zip.value)
            .then(function(response){
              if (response.ok) {
                return response.json();
              }
              throw Error('No data for ZIP code ' + location.zip.value);
            })
            .then(function(parsed_json) {
              location.city.value = parsed_json.places[0]["place name"];
              location.state.value = parsed_json.places[0]["state"];
            })
            .catch(function(error) {
              console.log(error);
              location.city.value = '';
              location.state.value = '';
            });
        }
      });

    }

    // Listen for click events on new submit button, and submit
    // the form when it's clicked
    order.eh_submit_button.addEventListener('click', function(event) {
      // Submit the form
      event.preventDefault();
      order.submit_button.click();
    });

    // Replace the select element with a collection of size buttons

    // Listen for clicks on the size buttons, and set the corresponding
    // element from the hidden select element

    // Listen for the form's submit event, intercept it and
    // display an order confirmation where the form once was
    order.form.addEventListener('submit', function(e){
      e.preventDefault();
      console.log('Caught the submit event on JS refactor');
    });
*/
  // End of DOMContentLoaded
  });

// End of IIFE
}());
