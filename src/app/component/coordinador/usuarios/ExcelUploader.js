import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

const ExcelUploader = ({ onUpload }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setLoading(true);
    const processedFiles = [];

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('File reading was aborted');
      reader.onerror = () => console.log('File reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const fileData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const codigo = String(fileData[1][1]);
        const documentoProfesor = String(fileData[0][1]);
        const grupoAsignatura = String(fileData[2][1]);
        const correoProfesor = String(fileData[2][3]);
        const nombreProfesor = String(fileData[0][3]);

        const students = [];
        for (let i = 4; i < fileData.length; i++) {
          const row = fileData[i];
          if (row[1] && row[2] && row[7]) {
            const student = {
              documento: String(row[1]),
              nombre: String(row[2]),
              correo: String(row[7])
            };
            students.push(student);
          }
        }

        processedFiles.push({ codigo, documentoProfesor, grupoAsignatura, correoProfesor, nombreProfesor, students });

        if (processedFiles.length === acceptedFiles.length) {
          setUploadedFiles(processedFiles);
          sendToBackend(processedFiles);
        }
      };
      reader.readAsBinaryString(file);
    });
  }, []);

  const sendToBackend = async (files) => {
    try {
      const response = await fetch('https://td-g-production.up.railway.app/usuario/LoadStudents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files })
      });
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error('Backend returned an error:', errorResponse);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Data sent successfully');
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 1300);
    } catch (error) {
      console.error('Error sending data to backend:', error);
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  return (
    <div>
      <div className='cursor-pointer' {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta los archivos aquí...</p>
        ) : (
          <p>Haz clic aquí para seleccionar los archivos extraídos del Polidinámico con los estudiantes.</p>
        )}
      </div>
      {(loading || success) && <div className="overlay"></div>}
      {loading && <div className="popup">Cargando...</div>}
      {success && <div className="popup">Carga Exitosa</div>}
      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border: 1px solid #ccc;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default ExcelUploader;
