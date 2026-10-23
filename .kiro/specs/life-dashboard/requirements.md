# Requirements Document

## Introduction

Life Dashboard (Dasbor Kehidupan) adalah aplikasi web sederhana berbasis halaman tunggal yang membantu pengguna mengatur keseharian mereka. Dasbor ini menampilkan waktu dan tanggal dengan sapaan dinamis berdasarkan waktu, daftar tugas (to-do list) yang tersimpan di sisi klien, pengatur waktu fokus (focus timer) bergaya Pomodoro 25 menit, serta tautan cepat (quick links) ke situs web favorit. Seluruh data disimpan menggunakan Local Storage browser sehingga tidak memerlukan server backend.

Aplikasi dibangun dengan HTML, CSS, dan Vanilla JavaScript tanpa framework, agar ringan, cepat dimuat, dan kompatibel dengan browser modern (Chrome, Firefox, Edge, Safari). Dasbor dapat digunakan sebagai halaman web mandiri atau sebagai homepage pada browser extension.

## Glossary

- **Life_Dashboard**: Aplikasi web dasbor kehidupan halaman tunggal yang menjadi sistem utama yang dibangun.
- **Dashboard_Page**: Halaman utama yang menampilkan seluruh widget Life_Dashboard.
- **Greeting_Widget**: Komponen yang menampilkan waktu, tanggal, dan sapaan dinamis berdasarkan waktu.
- **Focus_Timer**: Komponen pengatur waktu fokus dengan durasi hitung mundur 25 menit.
- **To_Do_List**: Komponen daftar tugas yang mengelola penambahan, pengeditan, penandaan selesai, dan penghapusan tugas.
- **Quick_Links**: Komponen tautan cepat yang menampilkan tombol untuk membuka situs web favorit.
- **Task**: Item tugas dalam To_Do_List yang memiliki identifier unik, deskripsi teks, dan status "done" atau "not done".
- **Quick_Link**: Item tautan dalam Quick_Links yang memiliki identifier unik, nama tampilan, dan URL situs web.
- **Local_Storage**: API penyimpanan sisi klien browser (localStorage) yang dipakai untuk menyimpan data secara persisten di perangkat pengguna.
- **User**: Pengguna yang mengakses dan mengoperasikan Life_Dashboard.
- **Theme**: Tema warna Life_Dashboard, dapat berupa mode terang (light) atau mode gelap (dark).
- **Theme_Toggle**: Komponen yang mengubah Theme Life_Dashboard antara mode terang dan mode gelap.
- **Sort_Control**: Komponen yang mengatur urutan tampilan Tasks dalam To_Do_List.
- **Sort_Mode**: Mode pengurutan Tasks dalam To_Do_List, termasuk pengurutan berdasarkan status (Tasks "not done" ditampilkan sebelum Tasks "done") dan pengurutan berdasarkan urutan pembuatan.

## Requirements

### Requirement 1: Tampilan Waktu dan Tanggal (Greeting Widget)

**User Story:** As a User, I want to see the current time and date, so that I can stay oriented throughout my day.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM:SS format.
2. THE Greeting_Widget SHALL display the current date including the name of the day of the week, the day of the month, the name of the month, and the year.
3. WHEN the second value changes, THE Greeting_Widget SHALL update the displayed time within 1 second.
4. WHEN the calendar date changes, THE Greeting_Widget SHALL update the displayed date within 1 second.

### Requirement 2: Sapaan Berdasarkan Waktu (Time-based Greeting)

**User Story:** As a User, I want a greeting that changes based on the time of day, so that the dashboard feels personal and relevant.

#### Acceptance Criteria

1. WHILE the current time is between 05:00 and 11:59, THE Greeting_Widget SHALL display a morning greeting containing the greeting word "pagi".
2. WHILE the current time is between 12:00 and 14:59, THE Greeting_Widget SHALL display an afternoon greeting containing the greeting word "siang".
3. WHILE the current time is between 15:00 and 18:59, THE Greeting_Widget SHALL display a late afternoon greeting containing the greeting word "sore".
4. WHILE the current time is between 19:00 and 04:59, THE Greeting_Widget SHALL display an evening greeting containing the greeting word "malam".
5. WHEN the current time crosses from one time period into another, THE Greeting_Widget SHALL update the displayed greeting to match the new time period within 1 second.

### Requirement 3: Pengatur Waktu Fokus (Focus Timer)

**User Story:** As a User, I want a 25-minute focus timer, so that I can concentrate on my work using the Pomodoro technique.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a countdown duration of 25 minutes (1500 seconds).
2. THE Focus_Timer SHALL display the remaining time in MM:SS format with zero-padded two-digit minutes and two-digit seconds.
3. WHEN the Focus_Timer reaches 00:00, THE Focus_Timer SHALL stop the countdown.
4. WHEN the Focus_Timer reaches 00:00, THE Focus_Timer SHALL display a visual message to the User indicating the focus session is complete.

### Requirement 4: Kontrol Focus Timer

**User Story:** As a User, I want to start, stop, and reset the timer, so that I can control my focus sessions.

#### Acceptance Criteria

1. WHILE the countdown is not running and the remaining time is greater than 00:00, WHEN the User presses the start button, THE Focus_Timer SHALL begin counting down from the current remaining time.
2. WHILE the countdown is running, WHEN the User presses the stop button, THE Focus_Timer SHALL pause the countdown and retain the displayed remaining time.
3. WHEN the User presses the reset button, THE Focus_Timer SHALL restore the countdown to 25 minutes and stop the countdown.
4. WHILE the countdown is running, THE Focus_Timer SHALL decrement the displayed time by 1 second every second.
5. IF the User presses the start button while the countdown is already running or the remaining time is 00:00, THEN THE Focus_Timer SHALL not alter the countdown.
6. IF the User presses the stop button while the countdown is not running, THEN THE Focus_Timer SHALL not alter the remaining time.

### Requirement 5: Penambahan Tugas (Add Task)

**User Story:** As a User, I want to add tasks to my to-do list, so that I can track what I need to do.

#### Acceptance Criteria

1. WHEN the User submits a new task via the input field, THE To_Do_List SHALL add the task to the displayed list and clear the input field.
2. WHEN a new Task is added, THE To_Do_List SHALL assign a unique identifier and a "not done" status to the Task.
3. IF the User submits a Task that contains no non-whitespace characters, THEN THE To_Do_List SHALL not add the Task to the list.
4. IF the User submits a Task whose description exceeds 200 characters, THEN THE To_Do_List SHALL not add the Task to the list.

### Requirement 6: Pengeditan Tugas (Edit Task)

**User Story:** As a User, I want to edit my tasks, so that I can correct or update task descriptions.

#### Acceptance Criteria

1. WHEN the User activates the edit control on a Task, THE To_Do_List SHALL present the Task description in an editable state.
2. WHEN the User confirms the edited description, THE To_Do_List SHALL update the Task with the new text and preserve the Task status.
3. IF the User confirms an edit that contains no non-whitespace characters, THEN THE To_Do_List SHALL retain the original Task description.
4. WHEN the User cancels the edit, THE To_Do_List SHALL retain the original Task description and exit the editable state.

### Requirement 7: Penandaan Tugas Selesai (Mark Task Done)

**User Story:** As a User, I want to mark tasks as done, so that I can see what I have completed.

#### Acceptance Criteria

1. WHEN the User toggles the completion control on a Task, THE To_Do_List SHALL switch the Task status between "done" and "not done".
2. WHILE a Task status is "done", THE To_Do_List SHALL display a strikethrough line through the Task description to visually distinguish it from "not done" Tasks.

### Requirement 8: Penghapusan Tugas (Delete Task)

**User Story:** As a User, I want to delete tasks, so that I can remove completed or unwanted items.

#### Acceptance Criteria

1. WHEN the User activates the delete control on a Task, THE To_Do_List SHALL remove that Task from the displayed list and preserve all other Tasks in the displayed list unchanged.

### Requirement 9: Penyimpanan Tugas di Local Storage

**User Story:** As a User, I want my tasks saved in the browser, so that they persist when I reopen the dashboard.

#### Acceptance Criteria

1. WHEN a Task is added, edited, marked, or deleted, THE To_Do_List SHALL save the updated task list, including each Task's identifier, description, and status, to Local_Storage.
2. WHEN the Life_Dashboard loads, THE To_Do_List SHALL load the saved task list from Local_Storage and display each Task with its retained identifier, description, and status.
3. IF Local_Storage contains no saved Tasks, THEN THE To_Do_List SHALL display an empty list.
4. IF Local_Storage is unavailable or a save operation fails, THEN THE To_Do_List SHALL retain the current Task list in the displayed list without clearing it.
5. IF the saved task list in Local_Storage cannot be parsed as valid Tasks, THEN THE To_Do_List SHALL display an empty list.

### Requirement 10: Tautan Cepat (Quick Links)

**User Story:** As a User, I want buttons that open favorite websites, so that I can quickly access them from the dashboard.

#### Acceptance Criteria

1. WHEN the User clicks a Quick_Link button, THE Quick_Links component SHALL open the associated website URL in a new browser tab.
2. THE Quick_Links component SHALL display each saved Quick_Link as a clickable button showing the Quick_Link name.
3. WHEN the User adds a new Quick_Link with a name and URL, THE Quick_Links component SHALL assign a unique identifier to the Quick_Link and add the Quick_Link to the displayed list.
4. WHEN the User activates the delete control on a Quick_Link, THE Quick_Links component SHALL remove the Quick_Link from the displayed list.
5. IF the User submits a Quick_Link with an empty name, an empty URL, or a URL that does not start with http:// or https://, THEN THE Quick_Links component SHALL not add the Quick_Link and SHALL display an error indication to the User.

### Requirement 11: Penyimpanan Quick Links di Local Storage

**User Story:** As a User, I want my quick links saved in the browser, so that they persist when I reopen the dashboard.

#### Acceptance Criteria

1. WHEN a Quick_Link is added or deleted, THE Quick_Links component SHALL save the updated link list to Local_Storage.
2. WHEN the Life_Dashboard loads, THE Quick_Links component SHALL load the saved link list from Local_Storage and display it.
3. IF Local_Storage contains no saved Quick_Links, THEN THE Quick_Links component SHALL display an empty list.

### Requirement 12: Tumpukan Teknologi (Technology Stack)

**User Story:** As a developer, I want a defined technology stack, so that the dashboard is built consistently without external dependencies.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL be built using HTML for structure, CSS for styling, and Vanilla JavaScript for behavior.
2. THE Life_Dashboard SHALL not require any backend server or server-side processing.
3. THE Life_Dashboard SHALL not use any external JavaScript frameworks or libraries, including but not limited to React, Vue, or Angular.
4. THE Life_Dashboard SHALL not use any external CSS frameworks or external CSS libraries.

### Requirement 13: Kompatibilitas Browser (Browser Compatibility)

**User Story:** As a User, I want the dashboard to work in my browser, so that I can use it regardless of my preferred browser.

#### Acceptance Criteria

1. WHEN the Life_Dashboard is loaded in the latest stable version of Chrome, Firefox, Edge, or Safari available at time of testing, THE Life_Dashboard SHALL render all UI components without visual distortion and execute all interactive features without generating JavaScript console errors.
2. WHEN the Life_Dashboard is opened as a standalone web page via a browser URL, THE Life_Dashboard SHALL display its interface without requiring browser extension installation.
3. WHEN a new browser tab is opened in a browser extension configured with the Life_Dashboard as its homepage, THE Life_Dashboard SHALL load and display its interface in the new tab view.

### Requirement 14: Kinerja (Performance)

**User Story:** As a User, I want a fast and responsive dashboard, so that my work is not interrupted by lag.

#### Acceptance Criteria

1. WHEN the User navigates to the Dashboard_Page over a connection with a minimum download speed of 10 Mbps, THE Life_Dashboard SHALL render all default widgets with their initial content visibly displayed within 2 seconds of the navigation request.
2. WHEN the User performs a click, input, or scroll action on any widget, THE Life_Dashboard SHALL update the display with a visible response within 100 milliseconds.
3. IF the connection download speed is less than 10 Mbps, THEN THE Life_Dashboard SHALL still load and display all widgets without generating JavaScript errors.

### Requirement 15: Desain Visual (Visual Design)

**User Story:** As a User, I want a clean and readable interface, so that I can use the dashboard comfortably.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL display the Greeting_Widget, Focus_Timer, To_Do_List, and Quick_Links as visually distinct sections separated by an equal spacing gap of at least 16 pixels between adjacent widgets, with each widget heading rendered in a larger or bolder font than its body content.
2. THE Life_Dashboard SHALL render all body text at a minimum font size of 16 pixels and maintain a minimum text-to-background contrast ratio of 4.5:1 across all widgets.

### Requirement 16: Struktur Folder (Folder Structure)

**User Story:** As a developer, I want a clean folder structure, so that the codebase remains organized and maintainable.

#### Acceptance Criteria

1. THE Life_Dashboard SHALL contain exactly one CSS file located inside the css/ directory.
2. THE Life_Dashboard SHALL contain exactly one JavaScript file located inside the js/ directory.
3. THE Life_Dashboard SHALL contain exactly one HTML file located at the project root directory.

### Requirement 17: Penyebaran (Deployment)

**User Story:** As a developer, I want to publish the dashboard online, so that users can access it easily.

#### Acceptance Criteria

1. WHEN deployed to GitHub Pages from a repository managed through GitHub Desktop, THE Life_Dashboard SHALL load and display the Dashboard_Page at the GitHub Pages public URL.
2. WHILE hosted on GitHub Pages, THE Life_Dashboard SHALL operate all widgets using only client-side resources, without requiring server-side configuration or server-side processing.
3. WHILE hosted on GitHub Pages, THE Life_Dashboard SHALL load all CSS and JavaScript resources without resource-loading errors.

### Requirement 18: Mode Terang/Gelap (Light/Dark Mode)

**User Story:** As a User, I want to switch the dashboard between light and dark color themes, so that I can choose a comfortable appearance for my environment.

#### Acceptance Criteria

1. WHEN the User activates the Theme_Toggle, THE Theme_Toggle SHALL switch the Life_Dashboard between the light Theme and the dark Theme.
2. WHEN the User changes the Theme, THE Theme_Toggle SHALL save the selected Theme to Local_Storage.
3. WHEN the Life_Dashboard loads, THE Theme_Toggle SHALL load the saved Theme from Local_Storage and apply the saved Theme to the Life_Dashboard.
4. IF Local_Storage contains no saved Theme or a saved Theme value that is neither the light Theme nor the dark Theme, THEN THE Theme_Toggle SHALL apply a default light Theme to the Life_Dashboard.
5. THE Theme_Toggle SHALL display a visible indicator that distinguishes the currently active Theme from the inactive Theme.
6. IF Local_Storage is unavailable or a save operation fails, THEN THE Theme_Toggle SHALL retain the currently active Theme on the Life_Dashboard without reverting the displayed Theme.

### Requirement 19: Cegah Tugas Duplikat (Prevent Duplicate Tasks)

**User Story:** As a User, I want to be prevented from creating or editing a task to duplicate an existing task, so that my to-do list stays clean and unambiguous.

#### Acceptance Criteria

1. IF the User submits a new Task whose description matches the description of an existing Task after trimming whitespace and ignoring case, THEN THE To_Do_List SHALL not add the Task, SHALL retain the submitted text in the input field, and SHALL display a visible error indication to the User indicating that the Task description duplicates an existing Task.
2. IF the User confirms an edit that sets a Task's description to match the description of another existing Task after trimming whitespace and ignoring case, THEN THE To_Do_List SHALL retain the original Task description, SHALL keep the Task in the editable state, and SHALL display a visible error indication to the User indicating that the Task description duplicates an existing Task.

### Requirement 20: Urutkan Tugas (Sort Tasks)

**User Story:** As a User, I want to sort my to-do list, so that I can find and prioritize my tasks more easily.

#### Acceptance Criteria

1. THE To_Do_List SHALL provide a Sort_Control that allows the User to select a Sort_Mode.
2. THE To_Do_List SHALL offer at least two Sort_Modes: a status sort that displays "not done" Tasks before "done" Tasks while preserving creation order within each status group, and a creation-order sort that preserves the order in which Tasks were added.
3. WHEN the User selects a Sort_Mode, THE To_Do_List SHALL reorder the displayed Tasks according to the selected Sort_Mode.
4. WHEN the User changes the Sort_Mode, THE To_Do_List SHALL save the selected Sort_Mode to Local_Storage.
5. WHEN the Life_Dashboard loads, THE To_Do_List SHALL load the saved Sort_Mode from Local_Storage and apply the saved Sort_Mode to the displayed Tasks.
6. IF Local_Storage contains no saved Sort_Mode or a saved Sort_Mode that is not a valid Sort_Mode, THEN THE To_Do_List SHALL apply a default Sort_Mode of creation order.
7. IF Local_Storage is unavailable or a save operation fails, THEN THE To_Do_List SHALL retain the selected Sort_Mode for the current session and SHALL display a visible error indication to the User.
