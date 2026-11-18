// TASK 4: Store job information using an array of objects
let jobsData = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TechNova",
        location: "Hyderabad, India",
        category: "Full Time",
        qualification: "B.Tech / B.E",
        experienceRequired: 1,
        salary: "₹6 - ₹10 LPA",
        skills: ["React", "JavaScript", "CSS"]
    },
    {
        id: 2,
        title: "Java Developer",
        company: "InnovateLabs",
        location: "Bangalore, India",
        category: "Full Time",
        qualification: "B.Tech / B.E",
        experienceRequired: 2,
        salary: "₹7 - ₹12 LPA",
        skills: ["Java", "Spring Boot", "SQL"]
    },
    {
        id: 3,
        title: "AI/ML Intern",
        company: "AI Solutions",
        location: "Hyderabad, India",
        category: "Internship",
        qualification: "B.Sc / BCA",
        experienceRequired: 0,
        salary: "₹25K - ₹40K / Month",
        skills: ["Python", "TensorFlow", "Pandas"]
    },
    {
        id: 4,
        title: "Python Developer",
        company: "DevWorks",
        location: "Remote",
        category: "Remote",
        qualification: "M.Tech / MCA",
        experienceRequired: 3,
        salary: "₹8 - ₹14 LPA",
        skills: ["Python", "Django", "Docker"]
    }
];

let selectedCategory = "All";

// TASK 13: Helper to show loading/error/success states
function showNotification(msg, type = "loading", duration = 3000) {
    const el = document.getElementById("statusMessage");
    el.className = `status-${type}`;
    el.style.display = "block";
    el.textContent = msg;
    if (duration > 0) {
        setTimeout(() => {
            el.style.display = "none";
        }, duration);
    }
}

// TASK 1, 2 & 5: Dynamically display job listings using forEach()
function displayJobs(jobsList) {
    const container = document.getElementById("jobContainer");
    container.innerHTML = "";

    if (jobsList.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 30px;">No jobs match your selected criteria.</p>`;
        return;
    }

    jobsList.forEach(job => {
        const card = document.createElement("div");
        card.className = "job-card";
        card.innerHTML = `
            <div>
                <div class="company">
                    <div class="company-logo">${job.company.charAt(0)}</div>
                    <div>
                        <h3>${job.company}</h3>
                        <p>${job.location}</p>
                    </div>
                </div>
                <h2>${job.title}</h2>
                <div class="details">
                    <span class="tag"><strong>Req:</strong> ${job.qualification}</span>
                    <span class="tag"><strong>Exp:</strong> ${job.experienceRequired}+ yrs</span>
                    <span class="tag">${job.category}</span>
                    ${job.skills.map(s => `<span class="tag">${s}</span>`).join("")}
                </div>
            </div>
            <div>
                <p class="salary">${job.salary}</p>
                <button class="apply-btn" onclick="applyForJob(${job.id})">Apply Now</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// TASK 6: Filter jobs using Array filter() based on qualification, experience, and category
function applyFilters() {
    const searchText = document.getElementById("searchInput").value.toLowerCase().trim();
    const qual = document.getElementById("qualificationFilter").value;
    const exp = document.getElementById("experienceFilter").value;

    const filtered = jobsData.filter(job => {
        const matchesCategory = (selectedCategory === "All" || job.category === selectedCategory);
        const matchesSearch = job.title.toLowerCase().includes(searchText) || job.company.toLowerCase().includes(searchText);
        const matchesQual = (qual === "" || job.qualification === qual);
        const matchesExp = (exp === "" || job.experienceRequired <= parseInt(exp));

        return matchesCategory && matchesSearch && matchesQual && matchesExp;
    });

    displayJobs(filtered);
}

function setCategoryFilter(category, buttonElement) {
    selectedCategory = category;
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    buttonElement.classList.add("active");
    applyFilters();
}

// TASK 12: Asynchronous Job Searching
async function triggerAsyncSearch() {
    showNotification("Searching jobs asynchronously...", "loading", 1000);
    await new Promise(resolve => setTimeout(resolve, 350));
    applyFilters();
}

// TASK 11 & 13: Fetch external job/user data with API error & loading handling
async function fetchExternalJobs() {
    showNotification("Fetching external job opportunities from public API...", "loading", 0);
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const apiJobs = data.map((item, index) => ({
            id: 100 + item.id,
            title: item.title.slice(0, 20).toUpperCase() + " Specialist",
            company: "Global Tech Inc (" + (index + 1) + ")",
            location: "Remote / Worldwide",
            category: "Remote",
            qualification: "B.Tech / B.E",
            experienceRequired: 1,
            salary: "₹12 - ₹18 LPA",
            skills: ["API", "Cloud", "JavaScript"]
        }));

        apiJobs.forEach(newJob => {
            if (!jobsData.some(j => j.id === newJob.id)) {
                jobsData.push(newJob);
            }
        });

        showNotification("Successfully fetched external jobs!", "success", 3000);
        applyFilters();
    } catch (err) {
        showNotification(`Failed to fetch external jobs: ${err.message}`, "error", 4000);
    }
}

// TASK 7: Validate applicant information
function validateApplicant(data) {
    if (!data.name || data.name.trim().length < 3) {
        alert("Please enter a valid name (at least 3 characters).");
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    if (!data.qualification) {
        alert("Please select your highest qualification.");
        return false;
    }
    if (data.experience === "" || isNaN(data.experience) || Number(data.experience) < 0) {
        alert("Please enter a valid non-negative number for experience.");
        return false;
    }
    return true;
}

// TASK 3, 4, 10: Store applicant information using LocalStorage & JSON
function saveApplicant() {
    const applicant = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        qualification: document.getElementById("qualification").value,
        experience: document.getElementById("experience").value.trim()
    };

    if (!validateApplicant(applicant)) return;

    localStorage.setItem("applicantProfile", JSON.stringify(applicant));
    showNotification("Applicant profile saved successfully!", "success", 3000);
}

function loadApplicantProfile() {
    const profile = JSON.parse(localStorage.getItem("applicantProfile"));
    if (profile) {
        document.getElementById("name").value = profile.name || "";
        document.getElementById("email").value = profile.email || "";
        document.getElementById("qualification").value = profile.qualification || "";
        document.getElementById("experience").value = profile.experience || "";
    }
}

// TASK 8, 9, 10: CRUD operations for Applications stored in LocalStorage
function getApplications() {
    return JSON.parse(localStorage.getItem("applications")) || [];
}

function saveApplications(apps) {
    localStorage.setItem("applications", JSON.stringify(apps));
    renderApplications();
}

// CREATE
function applyForJob(jobId) {
    const profile = JSON.parse(localStorage.getItem("applicantProfile"));
    if (!profile || !profile.name) {
        alert("Please fill and save your Applicant Profile at the bottom of the page before applying.");
        document.getElementById("profile").scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const targetJob = jobsData.find(j => j.id === jobId);
    let apps = getApplications();

    if (apps.some(a => a.jobId === jobId && a.applicantEmail === profile.email)) {
        alert("You have already applied for this position.");
        return;
    }

    const newApp = {
        appId: Date.now(),
        jobId: targetJob.id,
        jobTitle: targetJob.title,
        company: targetJob.company,
        applicantName: profile.name,
        applicantEmail: profile.email,
        status: "Pending",
        appliedAt: new Date().toLocaleDateString()
    };

    apps.push(newApp);
    saveApplications(apps);
    showNotification(`Applied to ${targetJob.title} at ${targetJob.company}!`, "success", 3000);
}

// UPDATE (Cycle Status)
function updateApplicationStatus(appId) {
    let apps = getApplications();
    const statuses = ["Pending", "Interviewing", "Accepted", "Rejected"];
    apps = apps.map(app => {
        if (app.appId === appId) {
            const currentIndex = statuses.indexOf(app.status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            app.status = statuses[nextIndex];
        }
        return app;
    });
    saveApplications(apps);
}

// DELETE
function deleteApplication(appId) {
    if (confirm("Are you sure you want to withdraw/delete this application?")) {
        let apps = getApplications();
        apps = apps.filter(app => app.appId !== appId);
        saveApplications(apps);
        showNotification("Application removed.", "success", 2500);
    }
}

// READ
function renderApplications() {
    const list = document.getElementById("applicationList");
    const apps = getApplications();
    list.innerHTML = "";

    if (apps.length === 0) {
        list.innerHTML = `<p style="color: #64748b; padding: 15px 0;">No active applications found. Apply for jobs above!</p>`;
        return;
    }

    apps.forEach(app => {
        const item = document.createElement("div");
        item.className = "application";
        item.innerHTML = `
            <div>
                <h3>${app.jobTitle}</h3>
                <p>${app.company} &bull; Applied: ${app.appliedAt} &bull; Applicant: ${app.applicantName}</p>
            </div>
            <div class="app-actions">
                <span class="status ${app.status}">${app.status}</span>
                <button class="action-btn update-btn" onclick="updateApplicationStatus(${app.appId})">Change Status</button>
                <button class="action-btn delete-btn" onclick="deleteApplication(${app.appId})">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Initialization
window.onload = function () {
    displayJobs(jobsData);
    loadApplicantProfile();
    renderApplications();
};
