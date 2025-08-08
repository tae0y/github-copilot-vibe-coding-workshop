import { useState } from 'react';

export default function useApiStatus() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  return { error, setError, loading, setLoading };
}
