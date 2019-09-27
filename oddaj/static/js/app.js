document.addEventListener("DOMContentLoaded", function() {
  /**
   * HomePage - Help section
   */
  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    /**
     * TODO: callback to page change event
     */
    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;

      console.log(page);
    }
  }
  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
        }
      });
    }
  }
  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function(e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep++;
          this.updateForm();
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */
    updateForm() {
      this.$step.innerText = this.currentStep;

      // TODO: Validation

      this.slides.forEach(slide => {
        slide.classList.remove("active");

        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;

      // TODO: get data from inputs and show them in summary
    }

    /**
     * Submit form
     *
     * TODO: validation, send data to server
     */
    submit(e) {
      if (this.currentStep < 5){
      e.preventDefault();
      }
      this.currentStep++;
      this.updateForm();
    }
  }
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
});


var button1 = document.querySelector("#collect");
var button2 = document.querySelector("#infos");

function onClick1() {
    var list = [];
    blablabla = document.querySelector("body > section > div.form--steps-container > form > div:nth-child(2)");
    var boxes = blablabla.querySelectorAll("label >  input[type=checkbox]");
    var orgs = document.querySelectorAll('div:nth-child(4) > div');
    console.log(orgs);
    console.log(list);
    boxes.forEach(function (element) {
      if (element.checked){
        list.push(element.value)
      }
    });
    orgs.forEach(function (organization) {
      list.forEach(function (element) {
        if (organization.getAttribute("categories").includes(element)){
        organization.style.display = "block"
        }else{
          organization.style.display = "none"
        }
          })
    });
}

function onClick2() {
    var street = document.querySelector("div.form-section.form-section--columns > div:nth-child(1) > div:nth-child(2) > label > input[type=text]");
    var city = document.querySelector("div.form-section.form-section--columns > div:nth-child(1) > div:nth-child(3) > label > input[type=text]");
    var postcode = document.querySelector("div.form-section.form-section--columns > div:nth-child(1) > div:nth-child(4) > label > input[type=text]");
    var phone = document.querySelector("div.form-section.form-section--columns > div:nth-child(1) > div:nth-child(5) > label > input[type=phone]");
    var date = document.querySelector("div.form-section.form-section--columns > div:nth-child(2) > div:nth-child(2) > label > input[type=date]");
    var hour = document.querySelector("div.form-section.form-section--columns > div:nth-child(2) > div:nth-child(3) > label > input[type=time]");
    var addnotation = document.querySelector("div.form-section.form-section--columns > div:nth-child(2) > div:nth-child(4) > label > textarea");
    var quanity = document.querySelector("body > section > div.form--steps-container > form > div:nth-child(2) > div.form-group.form-group--inline > label > input[type=number]");
    var organization =
    document.querySelector("div.summary > div.form-section.form-section--columns > div:nth-child(1) > ul > li:nth-child(1)").innerHTML = street.value;
    document.querySelector("div.summary > div.form-section.form-section--columns > div:nth-child(1) > ul > li:nth-child(2)").innerHTML = city.value;
    document.querySelector("div.summary > div.form-section.form-section--columns > div:nth-child(1) > ul > li:nth-child(3)").innerHTML = postcode.value;
    document.querySelector("div.summary > div.form-section.form-section--columns > div:nth-child(1) > ul > li:nth-child(4)").innerHTML = phone.value;
    document.querySelector("div.summary > div.form-section.form-section--columns > div:nth-child(2) > ul > li:nth-child(1)").innerHTML = date.value;
    document.querySelector("div.summary > div.form-section.form-section--columns > div:nth-child(2) > ul > li:nth-child(2)").innerHTML = hour.value;
    document.querySelector("div.summary > div.form-section.form-section--columns > div:nth-child(2) > ul > li:nth-child(3)").innerHTML = addnotation.value;
}

button1.addEventListener('click', onClick1);
button2.addEventListener('click', onClick2);