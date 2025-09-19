<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $fullname = isset($_POST['fullname']) ? htmlspecialchars($_POST['fullname']) : '';
    $email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
    $message = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '';

    // Validate inputs
    if (!empty($fullname) && !empty($email) && !empty($message) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Prepare data to be saved (could also be a database insertion)
        $data = "Full Name: " . $fullname . "\n";
        $data .= "Email: " . $email . "\n";
        $data .= "Message: " . $message . "\n";
        $data .= "-------------------------\n";

        // Save data to a file (you can adjust the path as needed)
        $file = fopen("contact_form_submissions.txt", "a");
        fwrite($file, $data);
        fclose($file);

        // Redirect to a success page or show a success message
        echo "<p>Obrigado pela sua mensagem. Vamos entrar em contato em breve!</p>";
        echo "<script>
                setTimeout(function(){
                    window.location.href = 'index.html'; // ou a página principal do seu site
                }, 5000);
              </script>";
    } else {
        echo "Por favor, preencha todos os campos corretamente.";
    }
}
?>
