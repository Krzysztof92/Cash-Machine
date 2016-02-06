(function ()
{
    // Function flags
    var exitStatus = 0, //0 - when in menu; 1 - when in submenu
        menuStatus = 0, //0 - when not logged in; 1 - when in menu, 2-when in submenu
        digitStatus = 0, //0 - when card not inserted; 1 - when typing PIN, 2-when typing amount of cash to deposit/withdraw
        allowDigitType = false, //false - turn off keyboard; true - turn on keyboard
        digitLength = 0,
        divLength = 0,
        maxDigitLength = 0,
        accountStatus = 1000,
        money = "";

    // Variables for function expressions
    var screenManipulation,
        interfaceHandler,
        keyboardHandler,
        slotsHandler,
        cardInserted,
        submitKey,
        accountMenu,
        checkAccountStatus,
        depositMoney,
        withdrawMoney,
        actionListener,
        digitListener,
        exit;


    //Changes menus screen depend of which one is chosen
    screenManipulation = function(scrName)
    {
        var screenName = scrName;



        console.log('Current screenName: ', screenName);

        switch (screenName)
        {
            case 'Wpłata': depositMoney();
                            break;
            case 'Wypłata': withdrawMoney();
                            break;
            case 'Stan konta': checkAccountStatus();
                            break;
            case 'Wyjdź': exit();
                            break;
            default: console.log('Default.... what to do?');
                            break;
        }

    };

    //Invokes every time some button in interface is pressed
    interfaceHandler = function(ev)
    {
        console.log('\n Interface handler ev.target: ', ev.target.innerHTML);

        screenManipulation(ev.target.innerHTML);
    };

    //Invokes every time some keyboard button is pressed
    keyboardHandler = function(ev)
    {
        console.log('Keyboard handler ev.target: ', ev.target.innerHTML);
    };

    slotsHandler = function(ev)
    {
        if (ev.target.id === 'cardSlot')
        {
            console.log('Slots handler ev.target: ', ev.target.innerHTML);
        }
    };

    //After card button is pressed
    cardInserted = function()
    {
        //onScreen.innerHTML = "Wpisz kod PIN: ";
        var onScreen = document.getElementById('screen');
        divLength = onScreen.innerHTML.length;
        digitLength = 0;
        maxDigitLength = 4;
        digitStatus = 1;
        allowDigitType = true;
    };


    //After submit key is pressed
    submitKey = function()
    {
        if (digitStatus == 1)
        {
            pinCount++;
            var correctPIN = 1234;
            if(pinCount <= 3)
            {
                if (onScreen.innerHTML.slice(divLength, divLength + maxDigitLength) == correctPIN)
                {
                    setTimeout(accountMenu, 1000);
                }
                else
                {
                    if (pinCount < 3) onScreen.innerHTML += "<br> Błędny kod PIN! Wpisz PIN ponownie. <br> Pozostało prób: " + (3-pinCount);
                    allowDigitType = false;
                    setTimeout(cardInserted, 2500);
                    if (pinCount == 3 && (onScreen.innerHTML.slice(divLength, maxDigitLength) != correctPIN))
                    {
                       //// onScreen.innerHTML += "<br>Przekroczono limit prób - blokada";
                        allowDigitType = false;
                        setTimeout(exit, 2500);
                    }
                }

            }
        }
        else if (digitStatus == 2)
        {
            menuStatus = 1;
            var currentMoney = parseInt(onScreen.innerHTML.slice(divLength, divLength + digitLength));
            if (money === "up") accountStatus += currentMoney;
            else if (money === "down")
            {
                if (currentMoney > accountStatus)
                {
                   //// onScreen.innerHTML += "<br>Nie masz wystarczającej ilości środków na koncie! <br>Wpisz mniejszą kwotę.";
                    //console.log("Nie masz wystarczającej ilości środków na koncie! Wpisz mniejszą kwotę.");

                    setTimeout((new checkAccountStatus()).withdrawMoney(), 2500);
                }
                else accountStatus -= currentMoney;
                document.getElementById("moneySlot").innerHTML = String(currentMoney);

            }
            //  console.log("accountStatus " + accountStatus);
        }
    };


    // Main menu after PIN is accepted
    accountMenu = function()
    {
        console.log('[F] (main) accountMenu?');

        exitStatus = 0;
        menuStatus = 1;
        allowDigitType = false;
        digitLength = 0;

    };

    checkAccountStatus = function()
    {
        console.log('[F]checkAccountStatus?');

        exitStatus = 1;
        menuStatus = 2;
        allowDigitType = false;
        maxDigitLength = accountStatus.toString().length;
        //  console.log("accountStatus "+accountStatus);
       // onScreen.innerHTML = "Twój stan konta wynosi: " + accountStatus + "PLN";

        /*console.log('checkAccountStatus callback? ', callback);
        if (typeof callback === 'function') callback();*/
    };


    depositMoney = function()
    {
        console.log('[F]depositMoney?');

        exitStatus = 1;
        menuStatus = 2;
        digitStatus = 2;
        allowDigitType = true;
        //// onScreen.innerHTML = "Kwota do wpłaty: ";
        divLength = onScreen.innerHTML.length;
        //var maxDigitLength = maxDigitLength;
        // amount = onScreen.innerHTML.slice(divLength, maxDigitLength);

        money = "up";
        //  console.log("maxDigitLength " + maxDigitLength);
    };

    withdrawMoney = function()
    {
        console.log('[F]withdrawMoney?');

        exitStatus = 1;
        menuStatus = 2;
        digitStatus = 2;
        allowDigitType = true;
        //// onScreen.innerHTML = "Kwota do wypłaty: ";
        divLength = onScreen.innerHTML.length;
        // var maxDigitLength = maxDigitLength;
        //amount = onScreen.innerHTML.slice(divLength, maxDigitLength);
        //accountStatus -= amount;
        money = "down";
        //  console.log("maxDigitLength " + maxDigitLength);
    };



    // Function which handles machine buttons
   /* actionListener = function(actionName)
    {
        switch (actionName)
        {
            case 'deposit': if (menuStatus === 1) checkAccountStatus(depositMoney);
                break;
            case 'withdraw': if (menuStatus === 1) checkAccountStatus(withdrawMoney);
                break;
            case 'accountStatus': if (menuStatus === 1) checkAccountStatus();
                break;
            case 'insertCard': if (menuStatus === 0) cardInserted();
                break;
            case 'keyOk': /!*if (menuStatus === 0)*!/ submitKey();
                break;
            case 'exit': exit();
                break;
        }
    };*/


    // Function which handles num keyboard; checks which (sub)menu is now active and maintain appropriate add and delete of digits
    digitListener = function(value)
    {
        if (allowDigitType === false) return;

        function delDigit()
        {
            if (onScreen.innerHTML.length > divLength)
            {
              ////  onScreen.innerHTML = document.getElementById("screen").innerHTML.slice(0, -1);
                digitLength--;
            }
        }

        if (value === 'delete') delDigit();
        else if (value !== 'delete')
        {
            // console.log("string length " + divLength);
            if (divLength + digitLength < divLength + maxDigitLength)
            {
                document.getElementById("screen").innerHTML += parseInt(value);
                digitLength++;
            }
        }
    };


    // When "wyjdź" pressed
    exit = function()
    {
        console.log('[F]exit?');

        //////////////////////
        /*switch (exitStatus)
        {
            case 0: location.reload(true);
                break;
            case 1: accountMenu();
                break;
        }
        exitStatus = 0;*/
    };


    // Site start
    (function start()
    {
        var startScr = document.getElementById(''),
            subMenus = document.getElementsByClassName('sub-menus');

        for (var i = 0; i < subMenus.length; i++)
        {
            console.log('subMenus content: ', subMenus[i]);
        }

        //// onScreen = document.getElementById('screen');
        ////onScreen.innerHTML = "Włoż kartę do czytnika &nbsp; (kliknij /card/)";
        // console.log("inner length " + onScreen.innerHTML.length);
        pinCount = 0;

        (function eventsHandling(d)
        {
            d.getElementById('interface').addEventListener('click', interfaceHandler, false);
            d.getElementById('keyboard').addEventListener('click', keyboardHandler, false);
            d.getElementById('slots').addEventListener('click', slotsHandler, false);
        }(document));

    }());
}());