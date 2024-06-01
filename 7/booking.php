<?php

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $ename = $_POST['ename'];
    $ephone = $_POST['ephone'];
    $edate = $_POST['edate'];
    $etime = $_POST['etime'];
    $email = $_POST['email'];
    $eperson = $_POST['eperson'];

    // Recipient email address
    $to = "ehasalpha@gmail.com";

    // Email subject
    $subject = "Booking Table- Seven Spiece Resturant";

    // Email body
    $txt = "Full Name: $ename \r\nContact Number: $ephone \r\nedate: $edate \r\nTime: $etime \r\n Person : $eperson ";

    // Email headers
    $headers = "From: $email \r\n";
    $headers .= "Reply-To: $email \r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8 \r\n";
    // Attempt to send email
    if (mail($to, $subject, $txt, $headers)) {
        // If email sent successfully, redirect to index.html
        echo '<script>window.location.href = "index.html";alert("Message sent successfully!");</script>';
        exit(); // Make sure to exit after redirecting
    } else {
        // If email failed to send, display error message
        $alert_message = "Something went wrong";
        $alert_type = "failure";
    }
} else {
    // If form is not submitted, redirect to index.html
    header("Location: index.html");
    exit();
}
?>

