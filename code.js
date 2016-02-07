//(function ()
//{
    // Function flags
    /*var exitStatus = 0, //0 - when in menu; 1 - when in submenu
        menuStatus = 0, //0 - when not logged in; 1 - when in menu, 2-when in submenu
        digitStatus = 0, //0 - when card not inserted; 1 - when typing PIN, 2-when typing amount of cash to deposit/withdraw
        allowDigitType = false, //false - turn off keyboard; true - turn on keyboard
        digitLength = 0,
        divLength = 0,
        maxDigitLength = 0,
        accountStatus = 1000,
        money = "";*/

    // Variables for function expressions
    var screenManipulation,
        interfaceHandler,
        keyboardHandler,
        slotsHandler,
        checkPin,
        submitKey,
        accountMenu,
        checkAccountStatus,
        depositMoney,
        withdrawMoney,
        actionListener,
        digitListener,
        blockCard,
        exit;

    //Changes menus screen depend of which one is chosen
    screenManipulation = function(scrName)
    {
        var screenName = scrName;
        console.log('Current screenName: ', screenName);

        switch (screenName)
        {
            case 'depositButton': depositMoney();
                            break;
            case 'withdrawButton': withdrawMoney();
                            break;
            case 'checkAccountButton': checkAccountStatus();
                            break;
            case 'cardInserted': document.getElementById('pin').style.display = 'block';
                                document.getElementById('pin').getElementsByClassName('hints')[0].style.display = 'block';
                                //checkPin();
                            break;
            case 'wrongPin': document.getElementById('pin').getElementsByClassName('hints')[0].style.display = 'none';
                            document.getElementById('pin').getElementsByClassName('hints')[1].style.display = 'block';
                            break;
            case 'blocked': document.getElementById('pin').getElementsByClassName('hints')[1].style.display = 'none';
                            document.getElementById('pin').getElementsByClassName('hints')[2].style.display = 'block';
                            blockCard();
                            break;
            case 'exitButton': exit();
                            break;
            default: console.log('Default switch... what to do?');
                            break;
        }

    };

    //Invokes every time some button in interface is pressed
    interfaceHandler = function(ev)
    {
        if (ev.target.tagName.toUpperCase() !== 'INPUT' && ev.target.tagName.toUpperCase() !== 'P' && ev.target.tagName.toUpperCase() !== 'DIV')
        {
            console.log('\n Interface handler ev.target: ', ev.target.id, '|| ', ev.target.tagName);
            screenManipulation(ev.target.id);
        }
    };

    //Invokes every time some keyboard button is pressed
/*    keyboardHandler = function(ev, digitS, minimumPinLen, pinInput)
    {
        //console.log('Keyboard handler ev.target: ', ev.target.innerHTML);
        ////console.log('[F]keyboardHandler?');
        ////////////

        console.log('pinInput val: ', pinInput.value, '|| pinInputLen: ', pinInput.value.length);



        //if (ev.target.tagName.toUpperCase() !== 'DIV' && digitS === 1 && Number(ev.target.innerHTML) >= 0)
        {


            //pinInputVal += ev.target.innerHTML;
            //console.log('pinInput: ', pinInputVal);
            //console.log('minimumPinLen: ', minimumPinLen,'|| pinLen: ', pinLen);
        }
    };*/

    //Invokes when card is inserted (at the beginning)
    slotsHandler = function(ev, intervalId, iC, s, cS, slotListen)
    {
        if (ev.target.id === 'cardSlot' && slotListen === true)
        {
            console.log('Slots handler ev.target: ', ev.target.innerHTML);
            console.log('listener? ',slotListen);
            console.log('intervalId: ', intervalId);
            clearInterval(intervalId);

            iC.style.display = 'none';
            cS.style.background = 'blue';
            cS.style.color = 'white';

            screenManipulation('cardInserted');
        }
    };

    //After card button is pressed
    checkPin = function(ev, pinInput, correctPin, pinCount, maxPinCount, failCount)
    {
        ////console.log('[F]checkPin?');
        ////console.log('pinInput val: ', pinInput.value, '/ pinInputLen: ', pinInput.value.length, 'correctPin: ', correctPin);

        //pinCount++;

        if (Number(pinInput.value) === correctPin)
        {
            console.log('PIN is correct!');
            return 1;
        }

        else if (pinCount < 3)
        {
            console.log('PIN is wrong! counter', pinCount);
            screenManipulation('wrongPin');

            document.getElementsByClassName('typeDigits')[1].value = '';

            if (failCount.textContent.length >= 18)
            {
                console.log('???');
                failCount.textContent = failCount.textContent.slice(0, -1);
            }

            failCount.textContent += maxPinCount - pinCount;
            console.log('failCount: ', failCount);

            return 2;
        }

        else
        {
            console.log('Your card is blocked!');

            screenManipulation('blocked');

            return 2;
        }


        //onScreen.innerHTML = "Wpisz kod PIN: ";

    /*  var onScreen = document.getElementById('screen');
        divLength = onScreen.innerHTML.length;
        digitLength = 0;
        maxDigitLength = 4;
        digitStatus = 1;
        allowDigitType = true;*/
    };

    blockCard = function()
    {
        var blink = 0;

        setInterval(function()
        {
            if (document.getElementById('cardSlot').style.background !== 'red')
            {
                document.getElementById('cardSlot').style.background = 'red';
                document.getElementById('cardSlot').style.color = 'white';
            }
            else
            {
                document.getElementById('cardSlot').style.background = 'white';
                document.getElementById('cardSlot').style.color = 'red';
            }

            blink++;
        }, 500);

        setTimeout(function()
        {
            location.reload(true);
        }, 4000);

    };

//////////////////////////////////////////
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
/////////////////////////////////////////

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
    function start()
    {
        /*var startScr = document.getElementById(''),
            mainMenus = document.getElementsByClassName('main-menus'),
            subMenus = document.getElementsByClassName('sub-menus');*/
        var iC = document.getElementById('insertCard'),
            s = document.getElementById('start'),
            cS = document.getElementById('cardSlot');

        iC.style.display = 'block';

        s.style.display = 'block';

        cS.style.color = 'green';
        cS.style.background = 'white';

        var intervalId = 0;
        intervalId = setInterval(function()
        {
            if (cS.style.color === 'green')
            {
                cS.style.color = 'white';
                cS.style.background = 'green';
            }

            else
            {
                cS.style.color = 'green';
                cS.style.background = 'white';
            }

        }, 1000);

        //// onScreen = document.getElementById('screen');
        ////onScreen.innerHTML = "Włoż kartę do czytnika &nbsp; (kliknij /card/)";
        // console.log("inner length " + onScreen.innerHTML.length);
        ////pinCount = 0;

        var correctPin = Number(1234);

        function eventsHandling(d)
        {
            var slotListening = true,
                digitStatus = 0, //0 - when started, 1 - when typing PIN
                minimumPinLen = 4,
                canCheckPin = false,
                pinCount = 0,
                maxPinCount = 3,
                failCount = document.getElementById('wrongPin').childNodes[5];

            d.getElementById('interface').addEventListener('click', interfaceHandler, false);
            d.getElementById('keyboard').addEventListener('click', function(ev)
            {
                ////console.log('EV!: ', ev.target.innerHTML);
                var pinInput = d.getElementsByClassName('typeDigits')[digitStatus - 1];

                //console.log('?pinCount: ', pinCount);

                if (ev.target.tagName.toUpperCase() !== 'DIV' && digitStatus > 0 && Number(ev.target.innerHTML) >= 0)
                {

                    pinInput.value += ev.target.innerHTML;
                    //console.log('pinInput: ', pinInput.value, '|| pressed: ', ev.target.innerHTML);

                    if (pinInput.value.length >= minimumPinLen)
                    {
                        //canCheckPin = keyboardHandler(ev, digitStatus, minimumPinLen, pinInput);
                        //canCheckPin = checkPin(ev, minimumPinLen, pinInput);

                        canCheckPin = true;
                    }

                }

                else if (ev.target.innerHTML === 'Del' && digitStatus > 0)
                {
                    //console.log('del');
                    if (pinInput.value.length)
                    {
                        //console.log('delete...', pinInput.value[pinInput.value.length-1]);
                        pinInput.value = pinInput.value.slice(0, -1);


                        if (pinInput.value.length < minimumPinLen)
                        {
                            canCheckPin = false;
                        }
                    }
                }

                else if (canCheckPin === true)
                {
                    if (ev.target.innerHTML === 'OK')
                    {
                        pinCount++;
                        //console.log('If >= 4 i can check: ', pinInput.value.length);
                        digitStatus = checkPin(ev, pinInput, correctPin, pinCount, maxPinCount, failCount);
                        console.log('[R]digitStatus?: ', digitStatus);
                    }
                }
            }, false);
            d.getElementById('slots').addEventListener('click', function(ev)
            {
                slotsHandler(ev, intervalId, iC, s, cS, slotListening);
                slotListening = false;
                digitStatus = 1;
            }, false);


        }
        eventsHandling(document);

    }
    start();
//}());