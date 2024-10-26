const PDFDocument = require('pdfkit');
const fs = require('fs');


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function createCV(data) {
    // Create a document
const doc = new PDFDocument();

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
const outputName = `${data.personalDetails.name}`;
doc.pipe(fs.createWriteStream(outputName + '.pdf'));

  // Set the border properties
  const borderWidth = 10;
  const borderColor = '#000000'; // Black color

  // Draw a rectangle around the entire content area of the document
  doc.rect(borderWidth, borderWidth, doc.page.width - 2 * borderWidth, doc.page.height - 2 * borderWidth)
      .lineWidth(1) // Border width
      .strokeColor(borderColor) // Border color
      .stroke(); // Draw the border

  doc.on('pageAdded', () => {
        doc.rect(borderWidth, borderWidth, doc.page.width - 2 * borderWidth, doc.page.height - 2 * borderWidth)
            .lineWidth(1) // Border width
            .strokeColor(borderColor) // Border color
            .stroke(); // Draw the border
  });

// Add title
doc.fontSize(25).text(`${data.personalDetails.name}`.toUpperCase(), {
  align: 'center'
});
doc.fontSize(12).text(`${data.personalDetails.address}`, {
    align: 'center'
  });
// Add contact info
doc.fontSize(12).text(`${data.personalDetails.email}`, {
  align: 'center'
});
doc.text(`${data.personalDetails.phone}`, {
  align: 'center'
});

doc.moveDown();

// Add a horizontal line
doc.moveTo(50, doc.y)
  .lineTo(550, doc.y)
  .stroke();
// Add a section for Education
doc.moveDown();
doc.font('Times-Roman').fontSize(14).text('Personal Details'.toUpperCase(), {
  underline: true
});
doc.moveDown();

const personalDetails = data.personalDetails;
doc.fontSize(12).text('Date of Birth:',{continued:true}).text(` ${personalDetails.dateOfBirth}`,{
  align: 'right'
});

doc.text('Gender:',{continued:true}).text(` ${personalDetails.gender}`,{
  align: 'right'
});

doc.text('Marital Status:',{continued:true}).text(` ${personalDetails.maritalStatus}`,{
  align: 'right'
});

doc.moveDown();
// Add a horizontal line
doc.moveTo(50, doc.y + 15)
  .lineTo(550, doc.y + 15)
  .stroke();
  
  doc.moveDown();
  doc.moveDown();
// Add a section for Education
doc.font('Times-Roman').fontSize(14).text('Educational Background'.toUpperCase(), {
  underline: true
});

doc.moveDown();
const education = data.education;
education.map(ed => { 
 
  doc.font('Times-Roman').fontSize(14).text(`${ed.level}`, {
    continued: true
  }).font('Times-Roman').text(` - ${ed.school}`, {
    align: 'right'
  });
  doc.font('Times-Roman').text(ed.duration, {
    align: 'right'
  });


  if (ed.grades === null) {
    doc.font('Times-Roman').text('Grades:');
    ed.grades.map(grade => {
      doc.font('Times-Roman').fontSize(12).text(`${grade.subject}`, {
        continued: true
      }).font('Times-Roman').text(`${grade.score}`, {
        align: 'right'
      });
    });
  }
});


doc.moveDown();
// Add a horizontal line
doc.moveTo(50, doc.y + 15)
  .lineTo(550, doc.y + 15)
  .stroke();
  
  doc.moveDown();
  doc.moveDown();
  
// Add a section for Experience
  doc.font('Times-Roman').fontSize(14).text('Work Experience'.toUpperCase(), {
    underline: true
  });

  const workExperience = data.workExperience;
  doc.moveDown();
  
  workExperience.map(wE => {
    doc.font('Times-Roman').fontSize(12).text(`${wE.position}`, {
      continued: true
    }).font('Times-Roman').text(`${wE.company}`, {
      align: 'right'
    });
    doc.font('Times-Roman').text(`${wE.duration}`, {
      align: 'right'
    });
  
  });
 
  doc.moveDown();
  // Add a horizontal line
  doc.moveTo(50, doc.y + 15)
    .lineTo(550, doc.y + 15)
    .stroke();
    
    doc.moveDown();
    doc.moveDown();
    
  const workReference = data.workReference
    // Add a section for Reference
  doc.font('Times-Roman').fontSize(14).text('Work Reference'.toUpperCase(), {
    underline: true
  });
  doc.moveDown();

  workReference.map(wr => {
    doc.font('Times-Roman').fontSize(12).text(`${wr.position}`, {
      continued: true
    }).font('Times-Roman').text(`${wr.company}`, {
      align: 'right'
    });
    doc.font('Times-Roman').text(`${wr.duration}`, {
      align: 'right'
    });
    
    doc.font('Times-Roman').text('Contact Details:');
    doc.font('Times-Roman').list([
      `${wr.contactName} ${wr.contactSurname}  (${wr.contactPosition})`,
      `${wr.contactPhone}`,
      `${wr.contactEmail}`,
    ]);
  })
  
  doc.moveDown();
  // Add a horizontal line
  doc.moveTo(50, doc.y + 15)
    .lineTo(550, doc.y + 15)
    .stroke();
    
    doc.moveDown();
    doc.moveDown();
// Add a section for Skills
doc.font('Times-Roman').fontSize(14).text('Skills'.toUpperCase(), {
  underline: true
});
doc.moveDown();
doc.font('Times-Roman').fontSize(12).list(data.skills);


doc.end();

}


module.exports = {
  createCV
}