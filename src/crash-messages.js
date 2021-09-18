//standardised crash messages

var bug_message = "Invalid operation, application closing";

/*----------------------------------------------------------------------------*/
function stopApplication (alert_message, console_message)
{
    alert (alert_message);
    console.log (console_message);
    process.exit();
}