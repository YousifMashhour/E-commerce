document.addEventListener("DOMContentLoaded", function () {
    // Get form elements
    const cancelBtn = document.getElementById("cancel-btn");
    const saveBtn = document.getElementById("save-btn");
    const checkoutForm = document.getElementById("checkout-form");

    // Form validation function
    function validateForm() {
        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const phone = document.getElementById("phone-number").value.trim();
        const address = document.getElementById("address").value.trim();

        // Check required fields
        if (!firstName || !lastName || !phone || !address) {
            alert("Please fill in all required fields.");
            return false;
        }
          
        // Validate first name (letters only)
        if (!/^[A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF ]+$/.test(firstName)) {
          alert("First name must contain only letters.");
          return false;
      }


      // Validate last name (letters only)
      if (!/^[A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF ]+$/.test(lastName)) {
        alert("Last name must contain only letters.");
        return false;
    }
        // Validate Egyptian phone number (starts with 01 and 11 digits)
        if (!/^01\d{9}$/.test(phone)) {
            alert("Phone number must start with 01 and be 11 digits long.");
            return false;
        }

        return true;
    }

    // Save button click 
    saveBtn.addEventListener("click", function (event) {
        event.preventDefault();
        
        if (validateForm()) {
            alert("Order confirmed successfully!");
            // Here you can add form submission logic
            // checkoutForm.submit();
        }
    });

    // Cancel button click 
    cancelBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to cancel your order?")) {
            alert("Order has been cancelled.");
            
        }
    });
});
