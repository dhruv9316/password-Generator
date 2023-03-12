const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// -initailly- //
let password="";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");

handleSlider();

// set password ki length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}
function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}
function generateUpperCase() {  
    return String.fromCharCode(getRandomInteger(65,91));
}
function generateSymbol(){
    const randomSymbolIndex = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomSymbolIndex);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) 
        {
        setIndicator("#0f0");
        }
    else if ( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) 
        {
        setIndicator("#ff0");
        }
    else 
        {
        setIndicator("#f00");
        }
}

async function copyContent () {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    }
    catch(e){
        copyMsg.innerText = "failed to copy";
    }
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}


function shufflingPassword(array) {
    //Fisher Yates Method :::---- [FINDING A (J) INDEX RANDOMLY AND SWAPPING IT WITH Ith INDEX]
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkBox) => {
        if(checkBox.checked)
            checkCount++;
    })

    // corner case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount == 0)
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // finding--new-password....

    console.log("Starting of generating");

    // removing... old-password
    password = "";

                    //checking checked checkBoxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //necessary addition of atleast 1 character for each of the checked checkBoxes
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("necessary adddition done");

    //rest of the characters
    //for(let i = funcArr.length; i < password.length; i++)
    //              oooooooooorrrrrrrrrrr
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }
    console.log("remaining adddition done");

    //shuffle the password
    password = shufflingPassword(Array.from(password));
    console.log("shuffling... done");

    //showing in UI
    passwordDisplay.value = password;
    console.log("adding in UI done");

    //stregth indicator updation
    calcStrength();

})
