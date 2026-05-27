<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $firstName       = htmlspecialchars($_POST['firstname'] ?? '');
    $lastName        = htmlspecialchars($_POST['lastname'] ?? '');
    $phone           = htmlspecialchars($_POST['phone'] ?? '');
    $email           = htmlspecialchars($_POST['email'] ?? '');
    $deliveryAddress = htmlspecialchars($_POST['deliveryaddress'] ?? '');
    $preferedDate    = htmlspecialchars($_POST['prefereddate'] ?? '');
    $timeSlot        = htmlspecialchars($_POST['timeslot'] ?? '');
    $notes           = htmlspecialchars($_POST['notes'] ?? '');
    $deliveryMethod  = htmlspecialchars($_POST['delivery_method'] ?? 'standard');

    date_default_timezone_set('Asia/Kuala_Lumpur');
    $timestamp = date("Y-m-d H:i:s");

    $logData = "===================================\n";
    $logData .= "Order Time: $timestamp\n";
    $logData .= "Name: $firstName $lastName\n";
    $logData .= "Phone: $phone\n";
    $logData .= "Email: $email\n";
    $logData .= "Delivery Method: $deliveryMethod\n";
    $logData .= "Delivery Address: $deliveryAddress\n";
    $logData .= "Preferred Date: $preferedDate\n";
    $logData .= "Time Slot: $timeSlot\n";
    $logData .= "Notes: $notes\n";
    $logData .= "===================================\n\n";

    file_put_contents("OrderMessages.txt", $logData, FILE_APPEND);

    echo "<script>
            alert('Order Placed Successfully!');
            window.location.href = '../YourOrder.html';
        </script>";
    exit();
} else {
    echo "<script>window.location.href = '../YourOrder.html';</script>";
    exit();
}
?>