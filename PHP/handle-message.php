<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 2. 接收表单里的所有输入数据 (安全过滤)
    $firstName = htmlspecialchars($_POST['firstname']);
    $lastName  = htmlspecialchars($_POST['lastname']);
    $email     = htmlspecialchars($_POST['email']);
    $phone     = htmlspecialchars($_POST['phone']); // 选填项
    $type      = htmlspecialchars($_POST['enquiry_type']);
    $message   = htmlspecialchars($_POST['message']);

    $timestamp = date("Y-m-d H:i:s");
    $logData = "===================================\n";
    $logData .= "Time: $timestamp\n";
    $logData .= "Name: $firstName $lastName\n";
    $logData .= "Email: $email\n";
    $logData .= "Phone: $phone\n";
    $logData .= "Enquiry Type: $type\n";
    $logData .= "Message:\n$message\n";
    $logData .= "===================================\n\n";

    file_put_contents("messages.txt", $logData, FILE_APPEND);

    echo "<script>
            alert('Message sent successfully! We will contact you soon.');
            window.location.href = '../ContactUs.html';
          </script>";
    exit();
} else {
    echo "<script>window.location.href = '../ContactUs.html';</script>";
    exit();
}
?>