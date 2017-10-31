<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Gus Lindquist - Contact Me</title>
  <link rel="stylesheet"
        type="text/css"
        media="screen"
        href="styles.css" />
  <link rel="stylesheet"
        type="text/css"
        media="print"
        href="print.css" />
<script type="text/javascript"
      src="javascript.js">
</script>
  <meta http-equiv="content-type"
        content="text/html; charset=utf-8" />
  <meta name="robots"
        content="all" />
</head>
<body>
  <div id="container">

     <div id="navcontainer">  
       <ul>  
         <li><a href="welcome.html"  
            rel="self"  
            id="current"  
            name="current">Home</a></li>  

         <li><a href="recordings.html"  
            rel="self">Recordings</a></li>  

         <li><a href="wedding.html"  
            rel="self">Weddings</a></li>  

         <li><a href="bio.html"
           rel="self">Bio</a></li>

        <li><a href="pictures.html"
           rel="self">Pictures</a></li>

      <li><a href="news.html"
           rel="self">News</a></li>
              <li><a href="software.html" rel="self">Software</a></li>
        
          <li><a href="contact.php"  
            rel="self">Contact Me</a></li>  
       </ul>  
     </div>  
     <!--
<img src="files/Gus_cutout_small.png" style="position:absolute; left:20px; top:0px;" />
-->
    <div id="pageHeader">
      <h1>Gus Lindquist</h1>
    </div>

    <div id="contentContainer">
      <div id="content">
        <script type="text/javascript">
//<![CDATA[
function validateForm(form) {

if (form.form_element0.value == "") {
alert("Fields marked with * are required.");
return false;
}

if (form.form_element1.value == "") {
alert("Fields marked with * are required.");
return false;
}

if (form.form_element2.value == "") {
alert("Fields marked with * are required.");
return false;
}

if (form.form_element3.value == "") {
alert("Fields marked with * are required.");
return false;
}

}
//]]>
</script> <?php

        $form_message = 'If you want to consider special music for your occasion, or if you just want to say "hi", fill in the form below to send me an email.';
        $email_address = 'contact@guslindquist.com';

        $form_element0 = $_POST['form_element0'];
        $sent_message .= '
        Your Name: '.stripslashes($_POST['form_element0'] );

        $form_element1 = $_POST['form_element1'];
        $sent_message .= '
        Your Email: '.stripslashes($_POST['form_element1'] );

        $form_element2 = $_POST['form_element2'];
        $sent_message .= '
        Subject: '.stripslashes($_POST['form_element2'] );

        $form_element3 = $_POST['form_element3'];
        $sent_message .= '
        Message: '.stripslashes($_POST['form_element3'] );

        if($form_element0 && $form_element1 && $form_element2 && $form_element3 &&  $email_address)
        {
        $mailed=mail($email_address, $form_element2, $sent_message, "From: $form_element1");
        $form_message = 'Thank you, your email has been sent.';
        }

        else {
        $form_message = 'Fill in the form below to send me an email.';

        }

        ?>

        <div class="message-text">
          <?php
           echo $form_message;
           ?>
        </div>

        <div class="required-text">
          Fields marked with * are required.
        </div>

        <form action="contact.php"
              method="post"
              onsubmit="return validateForm(this)">
          <p><label for="form_element0">Your Name:</label>
          <span class="required-text">*</span>
          <br />
          <input class="form-input-field"
                 type="text"
                 name="form_element0"
                 id="form_element0"
                 size="40" />
          <br />
          <br />
          <label for="form_element1">Your Email:</label>
          <span class="required-text">*</span>
          <br />
          <input class="form-input-field"
                 type="text"
                 name="form_element1"
                 id="form_element1"
                 size="40" />
          <br />
          <br />
          <label for="form_element2">Subject:</label> <span class=
          "required-text">*</span>
          <br />
          <input class="form-input-field"
                 type="text"
                 name="form_element2"
                 id="form_element2"
                 size="40" />
          <br />
          <br />
          <label for="form_element3">Message:</label> <span class=
          "required-text">*</span>
          <br />
          <textarea class="form-input-field"
                    name="form_element3"
                    id="form_element3"
                    rows="8"
                    cols="38">
</textarea>
          <br />
          <br />
          <input class="form-input-button"
                 type="reset"
                 name="resetButton"
                 value="Reset" /> <input class="form-input-button"
                 type="submit"
                 name="submitButton"
                 value="Submit" /></p>
        </form>

        <div id="breadcrumbcontainer"></div>
      </div>
    </div>

    <br style="clear: both;" />

    <div id="footer">
      © 2005 Gus Lindquist
    </div>
  </div>

  <div id="bottom">
    &nbsp;
  </div>
</body>
</html>
