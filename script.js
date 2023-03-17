const lengthSlider = document.querySelector("[data-lengthSlider]");
// const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordTab = document.querySelector("[data-passwordDisplay]");
// const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const lightIndicator = document.querySelector("[data-indicator]");
// const indicator = document.querySelector("[data-indicator]");
const generatorBtn = document.querySelector(".generator-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbolsList = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
// const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


// -initailly- //
let password="";
let passwordLength = 10;
let countCheck = 0;
setLightIndicator("#ccc");

handlingSlider();

// set password ki length
function handlingSlider() {
    lengthSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = lengthSlider.min;
    const max = lengthSlider.max;
    lengthSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}

function setLightIndicator(color) {
    lightIndicator.style.backgroundColor = color;
    lightIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
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
    const randomSymbolIndex = getRandomInteger(0, symbolsList.length);
    return symbolsList.charAt(randomSymbolIndex);
}

function findStrength() {
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
            setLightIndicator("#0f0");
        }
    else if ( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) 
        {
            setLightIndicator("#ff0");
        }
    else 
        {
            setLightIndicator("#f00");
        }
}

async function copyContent () {
    try{
        await navigator.clipboard.writeText(passwordTab.value);
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
    countCheck = 0;
    allCheckBox.forEach( (checkBox) => {
        if(checkBox.checked)
            countCheck++;
    })

    // corner case
    if(passwordLength < countCheck){
        passwordLength = countCheck;
        handlingSlider();
    }
}
allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
})

lengthSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handlingSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordTab.value)
        copyContent();
})

generatorBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if(countCheck == 0)
        return;

    if(passwordLength < countCheck){
        passwordLength = countCheck;
        handlingSlider();
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
    console.log("necessary addition done");

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
    passwordTab.value = password;
    console.log("adding in UI done");

    //stregth indicator updation
    findStrength();

})
