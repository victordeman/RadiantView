window.config = {
  routerBasename: '/ohif',
  dataSources: [{
    namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
    sourceName: 'orthanc',
    configuration: {
      friendlyName: 'Orthanc DICOMweb',
      name: 'orthanc',
      wadoUriRoot: '/api/orthanc/wado',
      qidoRoot: '/api/orthanc/dicom-web',
      wadoRoot: '/api/orthanc/dicom-web',
      qidoSupportsIncludeField: false,
      supportsReject: false,
      imageRendering: 'wadors',
      thumbnailRendering: 'wadors',
      enableStudyLazyLoad: true,
      supportsFuzzyMatching: false,
      supportsWildcard: true,
    },
  }],
};
