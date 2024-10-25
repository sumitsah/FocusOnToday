const progressBarContainer = document.querySelector('.progress-bar-container');
let goalContainer = document.querySelectorAll('.goal-container');
const progressBar = document.querySelector('.progress-bar');
const progressBarSpan = document.querySelector('.progress-bar span');
let inputFields = document.querySelectorAll('.goal-input')
const errorLabel = document.querySelector('.error-label')
const progressLabel = document.querySelector('.progress-label')
const progressValue = document.querySelector('.progress-value')
const btnContainer = document.querySelector('.button-container')
const btnList = document.querySelectorAll('button');
let customCheckbox = document.querySelector('.custom-checkbox')

// Adding this to capture event of dynamically added element
const goalsCard = document.querySelector('.goals-card');

const allQuotes = [
    'Raise the bar by completing your goals!',
    'Well begun is half done!',
    'Just a step away, keep going!',
    'Whoa! You just completed all the goals, time for chill :D',
    'Wow, it\'s another day',
    'Raise the bar by completing your goals!',
    'Well begun is half done!',
    'Just a step away, keep going!',
    'Whoa! You just completed all the goals, time for chill :D'
]

let allGoals = JSON.parse(localStorage.getItem('allGoals')) || {};

createGoalContainer = (i) => {
    const goalContainer = document.createElement('div')
    goalContainer.classList.add('goal-container');

    const customCheckbox = document.createElement('div')
    customCheckbox.classList.add('custom-checkbox');

    const checkIconImg = document.createElement('img')
    checkIconImg.classList.add('check-icon');
    checkIconImg.setAttribute('src', './images/check-icon2.svg')
    checkIconImg.setAttribute('alt', 'check-icon')

    const goalInput = document.createElement('input')
    goalInput.classList.add('goal-input');
    goalInput.setAttribute('type', 'text')
    goalInput.setAttribute('placeholder', 'Add new goal...')
    goalInput.setAttribute('autocomplete', 'off')
    goalInput.setAttribute('id', i ? Object.keys(allGoals)[i] : Date.now())

    customCheckbox.append(checkIconImg)
    goalContainer.append(customCheckbox, goalInput)

    return goalContainer;
}

updateNodes = () => {
    let i = 0;
    // get the allGoals keys which is not part of goalcontainer and update when refresh
    Object.keys(allGoals).forEach(key => {
        [...goalContainer].some(goal => { if ((goal.lastElementChild.getAttribute('id') === key)) i++; })
    })

    if (goalContainer.length < Object.keys(allGoals).length) {
        for (let j = i; j < Object.keys(allGoals).length; j++) {
            btnContainer.insertAdjacentElement('beforebegin', createGoalContainer(j))
        }
    }
}
updateNodes();

getCompletedGoalsCount = () => Object.values(allGoals).filter((goal) => goal.completed).length;

updateProgressBar = () => {
    inputFields = document.querySelectorAll('.goal-input')
    progressBar.style.width = `${(getCompletedGoalsCount() / inputFields.length) * 100}%`
    progressBar.firstElementChild.innerText = `${getCompletedGoalsCount()}/${inputFields.length} completed`
}
updateProgressBar();
progressLabel.innerText = allQuotes[getCompletedGoalsCount()]

updateInputFields = () => {
    inputFields.forEach(input => {
        if (allGoals[input.id]) {
            input.value = allGoals[input.id].name

            if (allGoals[input.id].completed) {
                input.parentElement.classList.add('completed')
            }
        }
    })
}

updateInputFields();
// Add or remove goal in DOM
btnList.forEach((btn) => {
    goalContainer = document.querySelectorAll('.goal-container');
    btn.addEventListener('click', (e) => {
        if (btn.id === 'addGoalContainer' && (goalContainer.length < 5)) {
            let tempGoalContainer = createGoalContainer();
            btnContainer.insertAdjacentElement('beforebegin', tempGoalContainer)
            updateProgressBar();
        }

        goalContainer = document.querySelectorAll('.goal-container');
        if (btn.id === 'removeGoalContainer' && (goalContainer.length >= 2)) {
            goalContainer[goalContainer.length - 1].remove();
            delete allGoals[`${goalContainer[goalContainer.length - 1].lastElementChild.getAttribute('id')}`]
            localStorage.setItem('allGoals', JSON.stringify(allGoals));
            updateProgressBar();
        }
        goalContainer = document.querySelectorAll('.goal-container');
    })
})

goalsCard.addEventListener('click', (e) => {
    if (e.target.classList.contains('custom-checkbox')) {
        inputFields = document.querySelectorAll('.goal-input')
        const allGoalsAdded = [...inputFields].every(function (input) {
            return input.value
        })

        // Check if all the input goals are filled
        if (allGoalsAdded) {
            console.log(e.target.parentElement);
            e.target.parentElement.classList.toggle('completed');
            const inputId = e.target.nextElementSibling.id
            // update  the allGoals object for completed goals true/false
            allGoals[inputId].completed = !allGoals[inputId].completed;

            // To update the progress bar and label we need to how many goals are completed by using allGoals object.
            updateProgressBar();
            progressLabel.innerText = allQuotes[getCompletedGoalsCount()]

            // At the end update everything to localstorage
            localStorage.setItem('allGoals', JSON.stringify(allGoals))
        } else {
            progressBarContainer.classList.add('show-error')
        }
    } else if (e.target.classList.contains('check-icon')) {
        inputFields = document.querySelectorAll('.goal-input')
        const allGoalsAdded = [...inputFields].every(function (input) {
            return input.value
        })

        // Check if all the input goals are filled
        if (allGoalsAdded) {
            e.target.parentElement.parentElement.classList.toggle('completed');
            const inputId = e.target.parentElement.nextElementSibling.id;
            // update  the allGoals object for completed goals true/false
            allGoals[inputId].completed = !allGoals[inputId].completed;

            // To update the progress bar and label we need to how many goals are completed by using allGoals object.
            updateProgressBar();
            progressLabel.innerText = allQuotes[getCompletedGoalsCount()]

            // At the end update everything to localstorage
            localStorage.setItem('allGoals', JSON.stringify(allGoals))
        } else {
            progressBarContainer.classList.add('show-error')
        }
    }

    // capture input events when typing and focusing and taking action
    if (e.target.classList.contains('goal-input')) {
        // On page reload update the allGoals values to DOM input fields and required class if goal is completed.
        if (allGoals[e.target.id]) {
            e.target.value = allGoals[e.target.id].name
            if (allGoals[e.target.id].completed) {
                e.target.parentElement.classList.add('completed')
            }
        }

        e.target.addEventListener('focus', () => {
            progressBarContainer.classList.remove('show-error')
        })

        e.target.addEventListener('input', (e) => {
            // chech if goal input object is present and, is completed then on user input restrict updating value of input by setting everything from localstorage allGoals.
            if (allGoals[e.target.id] && allGoals[e.target.id].completed) {
                e.target.value = allGoals[e.target.id].name
                return
            }

            //Add new(object) goals for object only if key(e.target.id) is not available otherwise update the already exisiting object   
            if (allGoals[e.target.id]) {
                allGoals[e.target.id].name = e.target.value
            } else {
                allGoals[e.target.id] = {
                    name: e.target.value,
                    completed: false,
                }
            }
            localStorage.setItem('allGoals', JSON.stringify(allGoals))
        })
    }
})