document.addEventListener('DOMContentLoaded', function() {
  // Handle all product forms
  const productForms = document.querySelectorAll('form[action*="/cart/add"]');
  
  productForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Make sure we have an ID
      if (!formData.get('id')) {
        alert('Please select a product option');
        return;
      }
      
      submitButton.disabled = true;
      submitButton.textContent = 'Adding...';
      
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.get('id'),
          quantity: formData.get('quantity') || 1
        })
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.description || 'Error adding to cart');
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        submitButton.textContent = 'Added!';
        submitButton.style.background = '#C9A56A';
        submitButton.style.color = '#fff';
        setTimeout(() => {
          window.location.href = '/cart';
        }, 800);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error adding to cart: ' + error.message);
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
    });
  });
});