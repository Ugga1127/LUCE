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

    // Pricing
    $subtotal     = htmlspecialchars($_POST['subtotal'] ?? '0.00');
    $deliveryFee  = htmlspecialchars($_POST['delivery_fee'] ?? '0.00');
    $grandTotal   = htmlspecialchars($_POST['grand_total'] ?? '0.00');

    // Cart items — sent as cart[0][name], cart[0][price], cart[0][qty], etc.
    $cartItems = $_POST['cart'] ?? [];

    date_default_timezone_set('Asia/Kuala_Lumpur');
    $timestamp = date("Y-m-d H:i:s");

    // ── Build the log ──────────────────────────────────────────────
    $logData  = "===================================\n";
    $logData .= "Order Time       : $timestamp\n";
    $logData .= "-----------------------------------\n";
    $logData .= "CUSTOMER DETAILS\n";
    $logData .= "-----------------------------------\n";
    $logData .= "Name             : $firstName $lastName\n";
    $logData .= "Phone            : $phone\n";
    $logData .= "Email            : $email\n";
    $logData .= "-----------------------------------\n";
    $logData .= "DELIVERY\n";
    $logData .= "-----------------------------------\n";
    $logData .= "Method           : $deliveryMethod\n";
    $logData .= "Address          : $deliveryAddress\n";
    $logData .= "Preferred Date   : $preferedDate\n";
    $logData .= "Time Slot        : $timeSlot\n";
    $logData .= "Notes            : $notes\n";
    $logData .= "-----------------------------------\n";
    $logData .= "ORDER SUMMARY\n";
    $logData .= "-----------------------------------\n";

    if (!empty($cartItems)) {
        $lineTotal = 0;
        foreach ($cartItems as $item) {
            $name  = htmlspecialchars($item['name']  ?? 'Unknown');
            $price = floatval($item['price'] ?? 0);
            $qty   = intval($item['qty']   ?? 1);
            $line  = $price * $qty;
            $lineTotal += $line;
            $logData .= sprintf("%-25s x%d   RM%6.2f\n", $name, $qty, $line);
        }
        $logData .= "-----------------------------------\n";
        $logData .= sprintf("Subtotal                       RM%6.2f\n", floatval($subtotal));
        $logData .= sprintf("Delivery Fee                   RM%6.2f\n", floatval($deliveryFee));
        $logData .= sprintf("GRAND TOTAL                    RM%6.2f\n", floatval($grandTotal));
    } else {
        $logData .= "(No cart items received)\n";
        $logData .= sprintf("Grand Total                    RM%6.2f\n", floatval($grandTotal));
    }

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