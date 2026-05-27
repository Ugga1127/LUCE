<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Collect Data
    $firstName = htmlspecialchars($_POST['firstname'] ?? '');
    $lastName  = htmlspecialchars($_POST['lastname'] ?? '');
    $email     = htmlspecialchars($_POST['email'] ?? '');
    $phone     = htmlspecialchars($_POST['phone'] ?? '');
    $type      = htmlspecialchars($_POST['enquiry_type'] ?? '');
    $message   = htmlspecialchars($_POST['message'] ?? '');
    
    date_default_timezone_set('Asia/Kuala_Lumpur');
    $timestamp = date("Y-m-d H:i:s");

    // Output
    $logData = "===================================\n";
    $logData .= "Time: $timestamp\n";
    $logData .= "Name: $firstName $lastName\n";
    $logData .= "Email: $email\n";
    $logData .= "Phone: $phone\n";
    $logData .= "Enquiry Type: $type\n";
    $logData .= "Message:\n$message\n";
    $logData .= "===================================\n\n";

    file_put_contents("ContactUsMessages.txt", $logData, FILE_APPEND);

    echo "<script>
            alert('Message sent successfully! We will contact you soon.');
            window.location.href = '../ContactUs.html';
        </script>";
    exit();
} 
else {
    echo "<script>window.location.href = '../ContactUs.html';</script>";
    exit();
}
?>