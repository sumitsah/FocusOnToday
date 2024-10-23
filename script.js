const progressBar = document.querySelector('.progress-bar');
const progressBarSpan = document.querySelector('.progress-bar span');
const progressLabel = document.querySelector('.progress-label');
const progressBarContainer = document.querySelector('.progress-bar-container');
const goalContainer = document.querySelectorAll('.goal-container');
const inputText1 = document.querySelector('#first');
const inputText2 = document.querySelector('#second');
const inputText3 = document.querySelector('#third');

let tasksCompleted = [];
const modifier = 33.333;
const progressText = ['Raise the bar by completing your goals!', 'Well begun is half done!', 'Just a step away, keep going!', 'Whoa! You just completed all the goals, time for chill :D'];
let allGoals = JSON.parse(localStorage.getItem('allGoals')) || {};

inputText1.value = allGoals?.first?.name || ''
inputText2.value = allGoals?.second?.name || '';
inputText3.value = allGoals?.third?.name || '';

if (allGoals?.first?.completed) {
    goalContainer[0].classList.add('completed');
    goalContainer[0].getElementsByClassName('check-icon')[0].src = './images/check-icon2.svg';
    addTask();
}

if (allGoals?.second?.completed) {
    goalContainer[1].classList.add('completed');
    goalContainer[1].getElementsByClassName('check-icon')[0].src = './images/check-icon2.svg';
    addTask();
}

if (allGoals?.third?.completed) {
    goalContainer[2].classList.add('completed');
    goalContainer[2].getElementsByClassName('check-icon')[0].src = './images/check-icon2.svg';
    addTask();
}

progressLabel.innerText = progressText[tasksCompleted.length]

for (let i = 0; i < goalContainer.length; i++) {
    goalContainer[i].addEventListener('click', (e) => {
        if (e.target.classList.contains('check-icon')) {
            if (inputText1.value === '' || inputText2.value === '' || inputText3.value === '') {
                progressBarContainer.classList.add('show-error');
            } else {
                progressBarContainer.classList.remove('show-error');
            }
            if (inputText1.value !== '' && inputText2.value !== '' && inputText3.value !== '') {
                if (e.currentTarget.classList.contains('completed')) {
                    e.currentTarget.classList.remove('completed');
                    tasksCompleted.pop();
                    const { style } = progressBar;
                    style.width = `${modifier * tasksCompleted.length}%`;
                    progressBarSpan.innerText = `${tasksCompleted.length}/3 completed`
                    progressLabel.innerText = progressText[tasksCompleted.length]
                    e.target.src = './images/check-icon.svg';
                    if (i === 0) {
                        allGoals.first.completed = false;
                    } else if (i === 1) {
                        allGoals.second.completed = false;
                    } else {
                        allGoals.third.completed = false;
                    }
                    localStorage.setItem('allGoals', JSON.stringify(allGoals))
                    setTimeout(() => {
                        if (tasksCompleted.length === 0) {
                            style.opacity = 0;
                        }
                    }, 270);
                } else {
                    e.currentTarget.classList.add('completed');
                    e.target.src = './images/check-icon2.svg';
                    console.log(e.target)
                    if (i === 0) {
                        allGoals.first.completed = true;
                    } else if (i === 1) {
                        allGoals.second.completed = true;
                    } else {
                        allGoals.third.completed = true;
                    }
                    localStorage.setItem('allGoals', JSON.stringify(allGoals))
                    addTask();
                }
            }
        }
        // if ((inputText1.value !== '' || inputText2.value !== '' || inputText3.value !== '') && progressBarContainer.classList.contains('show-error')) {
        //     progressBarContainer.classList.remove('show-error');
        // }
    })
}

inputText1.addEventListener('input', () => {
    if (!allGoals?.first?.completed) {
        allGoals = { ...allGoals, 'first': { 'name': inputText1.value, completed: false } }
        localStorage.setItem('allGoals', JSON.stringify(allGoals))
    } else {
        inputText1.value = allGoals.first.name;
    }

})

inputText2.addEventListener('input', () => {
    if (!allGoals?.second?.completed) {
        allGoals = { ...allGoals, 'second': { 'name': inputText2.value, completed: false } }
        localStorage.setItem('allGoals', JSON.stringify(allGoals))
    } else {
        inputText2.value = allGoals.second.name;
    }
})

inputText3.addEventListener('input', () => {
    if (!allGoals?.third?.completed) {
        allGoals = { ...allGoals, 'third': { 'name': inputText3.value, completed: false } }
        localStorage.setItem('allGoals', JSON.stringify(allGoals))
    } else {
        inputText3.value = allGoals.third.name;
    }
})

function addTask() {
    tasksCompleted.push(true);
    const { style } = progressBar;
    style.opacity = 1;
    style.width = `${modifier * tasksCompleted.length}%`;
    progressBarSpan.innerText = `${tasksCompleted.length}/3 completed`
    progressLabel.innerText = progressText[tasksCompleted.length]
}