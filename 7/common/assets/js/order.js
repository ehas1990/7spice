let currentPrice = 0;
    let quantity = 1;

    function setModalData(name, price) {
        currentPrice = price;
        quantity = 1;
        document.getElementById('productTitle').innerText = name;
        document.getElementById('quantity').innerText = quantity;
        document.getElementById('totalPrice').innerText = '₹' + (currentPrice * quantity).toFixed(2);
    }

    function changeQuantity(change) {
        quantity = Math.max(1, quantity + change);
        document.getElementById('quantity').innerText = quantity;
        document.getElementById('totalPrice').innerText = '₹' + (currentPrice * quantity).toFixed(2);
    }

    $(document).ready(function() {
        $('#payment-method').on('change', function() {
            if ($(this).val() === 'upi') {
                $('#qr-code-container').removeClass('hidden');
            } else {
                $('#qr-code-container').addClass('hidden');
            }
        });
    });

    // 
    document.addEventListener('DOMContentLoaded', function () {
        const readMoreButton = document.getElementById('readMoreButton');
        const productList = document.getElementById('productList');
        let currentlyDisplayed = 5; // Number of products initially displayed
    
        // Hide all products except the first 5
        const products = productList.querySelectorAll('.list-item');
        for (let i = currentlyDisplayed; i < products.length; i++) {
            products[i].style.display = 'none';
        }
    
        readMoreButton.addEventListener('click', function (event) {
            event.preventDefault();
            let nextToShow = currentlyDisplayed + 5;
            for (let i = currentlyDisplayed; i < nextToShow && i < products.length; i++) {
                products[i].style.display = 'block';
            }
            currentlyDisplayed += 5;
    
            // Hide the Read More button if all products are displayed
            if (currentlyDisplayed >= products.length) {
                readMoreButton.style.display = 'none';
            }
        });
    });
    