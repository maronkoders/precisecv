const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');


var data = 
{
    "personalDetails": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "address": "31 Smith Street, New York, Harare",
      "phone": "(263) 775 634 192",
      "dateOfBirth": "09/07/2000",
      "gender": "Male",
      "maritalStatus": "Single"
    },
    "education": [
      {
        "school": "Harvard University",
        "level": "Bachelor of Science",
        "duration": "2015 - 2019",
        "grades": [
          {
            "subject": "Mathematics",
            "score": "A"
          },
          {
            "subject": "Physics",
            "score": "B+"
          }
        ]
      }
    ],
    "workExperience": [
      {
        "position": "Software Engineer",
        "company": "Tech Corp",
        "duration": "2020 - Present"
      }
    ],
    "workReference": [
      {
        "position": "Manager",
        "company": "Tech Corp",
        "duration": "2020 - Present",
        "contactName": "Jane Smith",
        "contactSurname": "Doe",
        "contactEmail": "jane.smith@example.com",
        "contactPhone": "(263) 123 456 789",
        "contactPosition": "HR Manager"
      }
    ],
    "skills": [
      "JavaScript",
      "Node.js",
      "React"
    ]
  };

function createCV(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();
      const outputName = `${data.personalDetails.name.toLowerCase().replace(/\s+/g, '_')}`;
      const pdfDir = path.join(__dirname);
      const filePath = path.join(pdfDir, `${outputName}.pdf`);

      // Personal Details
      doc.setFont('Times', 'Normal');
      doc.setFontSize(14);
      doc.text('Personal Details', 20, 20);
      doc.setFontSize(12);
      doc.text(`Name: ${data.personalDetails.name}`, 20, 30);
      doc.text(`Email: ${data.personalDetails.email}`, 20, 40);
      doc.text(`Address: ${data.personalDetails.address}`, 20, 50);
      doc.text(`Phone: ${data.personalDetails.phone}`, 20, 60);
      doc.text(`Date of Birth: ${data.personalDetails.dateOfBirth}`, 20, 70);
      doc.text(`Gender: ${data.personalDetails.gender}`, 20, 80);
      doc.text(`Marital Status: ${data.personalDetails.maritalStatus}`, 20, 90);

      // Education
      doc.setFontSize(14);
      doc.text('Educational Background', 20, 110);
      doc.setFontSize(12);
      data.education.forEach((ed, index) => {
        const y = 120 + index * 20;
        doc.text(`${ed.level} - ${ed.school}`, 20, y);
        doc.text(ed.duration, 150, y);
        if (ed.grades && ed.grades.length > 0) {
          doc.text('Grades:', 20, y + 10);
          ed.grades.forEach((grade, gradeIndex) => {
            doc.text(`${grade.subject}: ${grade.score}`, 30, y + 20 + gradeIndex * 10);
          });
        }
      });

      // Work Experience
      doc.setFontSize(14);
      doc.text('Work Experience', 20, 160);
      doc.setFontSize(12);
      data.workExperience.forEach((wE, index) => {
        const y = 170 + index * 20;
        doc.text(`${wE.position} - ${wE.company}`, 20, y);
        doc.text(wE.duration, 150, y);
      });

      // Work Reference
      doc.setFontSize(14);
      doc.text('Work Reference', 20, 210);
      doc.setFontSize(12);
      data.workReference.forEach((wr, index) => {
        const y = 220 + index * 20;
        doc.text(`${wr.position} - ${wr.company}`, 20, y);
        doc.text(wr.duration, 150, y);
        doc.text('Contact Details:', 20, y + 10);
        doc.text(`${wr.contactName} ${wr.contactSurname} (${wr.contactPosition})`, 30, y + 20);
        doc.text(wr.contactPhone, 30, y + 30);
        doc.text(wr.contactEmail, 30, y + 40);
      });

      // Skills
      if (data.skills && data.skills.length > 0) {
        doc.setFontSize(14);
        doc.text('Skills', 20, 270);
        doc.setFontSize(12);
        data.skills.forEach((skill, index) => {
          doc.text(skill, 30, 280 + index * 10);
        });
      }

      // Save the PDF
      const pdfData = doc.output();
      fs.writeFileSync(filePath, pdfData, 'binary');
      resolve(filePath);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  createCV
};