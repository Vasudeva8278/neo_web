import React, { useEffect, useState } from 'react';
import HighlightTable from '../../pages/HighlightTable';
import { useParams } from 'react-router-dom';
import { getTemplateHighlights } from '../../services/templateApi';


const ExportComponent = () => {
  const { id, projectId } = useParams();
  const [highlightsArray, setHighlightsArray] = useState([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchDocument = async () => {
      if (id) {
        try {
          const response = await getTemplateHighlights(id);
          if (response) {
            setHighlightsArray(response.highlights);
            setFileName(response.fileName || '');
          } else {
            setHighlightsArray([]);
          }
        } catch (error) {
          setError('Failed to fetch document');
          console.error('Failed to fetch document', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocument();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-2">
      <HighlightTable
        highlightsArray={highlightsArray}
        templateId={id}
        filename={fileName}
        projectId={projectId}
      />
    </div>
  );
};

export default ExportComponent;
