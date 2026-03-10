const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
  let [resource, config] = args;

  const token = localStorage.getItem("token");
  if (token) {
    config = {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  console.log("Request intercepted:", resource, config);

  // Call the original fetch
  const response = await originalFetch(resource, config);

  return response;
};
