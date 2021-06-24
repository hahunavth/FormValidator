//---------------------------------------------------
//Handle Validator
/*Usage:
 * Validator(
 *    form: 'form-selector',
 *    errorSelector: '.form-message',
 *    rules: [
 *      Validator.type(selector)
 *    ],
 *    onSubmit: function (data) {
 *      handleSubmit(data)
 *    }
 *})
 */
//---------------------------------------------------
function Validator(option) {
  //select form element
  var formElement = document.querySelector(option.form);
  var selectorRules = {};

  if (formElement) {
    //handle submit -> formElement
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isValid = true;

      //selector rules
      option.rules.forEach(function (rule) {
        if (Array.isArray(selectorRules[rule.selector])) {
          selectorRules[rule.selector].push(rule.test);
        } else {
          selectorRules[rule.selector] = [rule.test];
        }
        var inputElement = formElement.querySelector(rule.selector);

        var rules = selectorRules[rule.selector];
        var formMessage = inputElement.parentElement.querySelector(
          option.errorSelector
        );

        for (var i = 0; i < rules.length; i++) {
          var errorMessage = rules[i](inputElement.value);
          if (errorMessage) {
            isValid = false;
            break;
          }
        }

        if (errorMessage) {
          formMessage.innerText = errorMessage;
          inputElement.classList.add("invalid");
        } else {
          inputElement.classList.remove("invalid");
          formMessage.innerText = "";
        }
      });

      if (isValid) {
        if (typeof option.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );

          var formValue = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            return (values[input.name] = input.value) && values;
          },
          {});

          option.onSubmit(formValue);
        } else {
          formElement.submit();
        }
      }
    };

    //handle input element blur
    option.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElement = formElement.querySelector(rule.selector);
      if (inputElement)
        inputElement.onblur = function () {
          var errorMessage;
          var formMessage = inputElement.parentElement.querySelector(
            option.errorSelector
          );
          var rules = selectorRules[rule.selector];

          for (var i = 0; i < rules.length; i++) {
            var errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
          }

          if (errorMessage) {
            formMessage.innerText = errorMessage;
            inputElement.classList.add("invalid");
          } else {
            inputElement.classList.remove("invalid");
            formMessage.innerText = "";
          }

          inputElement.oninput = function () {
            inputElement.classList.remove("invalid");
            formMessage.innerText = "";
          };
        };
    });
  }
}

//---------------------------------------------------
/*
 *Validate.type = function
 *[params]:
 *   - selector: querySelector. Ex: div, .class, #id.
 *[return]:
 *   {
 *     selector: string,
 *     test: (value) => return message
 *   }
 */
//---------------------------------------------------
Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var email = value.trim();
      function validateEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
      return validateEmail(email) ? undefined : "Trường này phải là email";
    },
  };
};

Validator.minLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= 6
        ? undefined
        : "Vui lòng nhập ít nhất " + min + " ký tự";
    },
  };
};

Validator.isConfirm = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Gía trị nhập vào không chính xác";
    },
  };
};
