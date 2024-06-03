let currentPrice = 0;
    let quantity = 1;

    function setModalData(name, price) {
        currentPrice = price;
        quantity = 1;
        document.getElementById('productTitle').innerText = name;
        document.getElementById('quantity').innerText = quantity;
        document.getElementById('totalPrice').innerText = '$' + (currentPrice * quantity).toFixed(2);
    }

    function changeQuantity(change) {
        quantity = Math.max(1, quantity + change);
        document.getElementById('quantity').innerText = quantity;
        document.getElementById('totalPrice').innerText = '$' + (currentPrice * quantity).toFixed(2);
    }

  