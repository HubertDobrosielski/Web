$(document).ready(function () {
    loadCoursesPage();
});
function loadCoursesPage() {
    $('#content').load('html/template/courses-page.html', function () {
        loadCoursesList();
    });
}
function loadLessonsPage(id) {
    $('#content').load('html/template/lessons-page.html', function () {
        loadLessonsList(id);
    });
}
function loadFlashcardsPage(courseId, lessonId) {
    $('#content').load('html/template/flashcards-page.html', function () {
        loadFlashcardsList(courseId, lessonId);
    });
}
let dataCache = null;
async function loadData() {
    if (!dataCache) {
        try {
            const response = await fetch('json/data.json');
            if (!response.ok) throw new Error("Network issue!");
            dataCache = await response.json();
        } catch (error) {
            console.error("data download was crashed:", error);
            window.location.href = "html/database-error.html";
        }
    }
    return dataCache;
}

async function loadCoursesList() {
    const data = await loadData();
    const coursesList = $('#courses-list');
    coursesList.empty();
    $.get('html/template/course-item.html', (templateHtml) => {
        data.courses.forEach(course => {
            const $courseItem = $(templateHtml);
            $courseItem.find('.course-title').text(course.title);
            $courseItem.find('.course-description').text(course.description);
            $courseItem.click(() => {loadLessonsPage(course.id);});
            coursesList.append($courseItem);
        });
    });
}
async function loadLessonsList(courseId) {
    const data = await loadData();
    const course = data.courses.find(c => c.id === courseId);
    $('#home-button').click(() => { loadCoursesPage() });
    const lessonsList = $('#lessons-list');
    lessonsList.empty();
    $.get('html/template/lesson-item.html', (templateHtml) => {
        course.lessons.forEach(lesson => {
            const $courseItem = $(templateHtml);
            $courseItem.find('.lesson-title').text(lesson.title);
            $courseItem.click(() => {
                console.log("Wybrano lekcje:", lesson.id);
                loadFlashcardsPage(courseId, lesson.id)
            });
            lessonsList.append($courseItem);
        });
    });
}

async function loadFlashcardsList(courseId, lessonId) {
    const data = await loadData();
    const flashcardList = $('#flashcards-list');
    flashcardList.empty();
    $('#back-button').click(() => {loadLessonsPage(courseId);});
    const course = data.courses.find(c => c.id === courseId);
    const lesson = course.lessons.find(l => l.id === lessonId);
    
    $.get('html/template/flashcard-item.html', (templateHtml) => {
        lesson.flashcards.forEach(flashcard => {
            const $courseItem = $(templateHtml);
            $courseItem.find('.question').text(flashcard.question);
            $courseItem.find('.answer').text(flashcard.answer);
            $courseItem.click(() => {$courseItem.toggleClass('flipped');});
            flashcardList.append($courseItem);
        });
    });
}



