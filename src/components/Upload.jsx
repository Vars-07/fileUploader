import React from 'react';
import './upload.css';

import Selector from './Selector';
import Progress from './Progress';
import Picky from 'react-picky';
import "react-picky/dist/picky.css";


const fileExtensions = [
    { name: 'JSON' },
    { name: 'MP4' },
    { name: 'ISO' },
    { name: 'txt' },
    // more extensions can be added.
];

export default class Upload extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploading: false,
            uploadProgress: {},
            successfullUploaded: false,
            allowedFileExtensions: [],
            error: false
        };

        this.onFilesAdded = this.onFilesAdded.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
        this.sendRequest = this.sendRequest.bind(this)
        this.renderActions = this.renderActions.bind(this)
        this.selectExtension = this.selectExtension.bind(this)
        this.validateExtension = this.validateExtension.bind(this)
        this.onError = this.onError.bind(this)
    }

    /**
     * 
     * @param {*} files List of files to be added.
     */
    onFilesAdded(files) {
        const { extensionNotSupported, filesInError } = this.validateExtension(files)
        if (extensionNotSupported.length) {
            this.onError(extensionNotSupported)
        }
        // filter out the files that are not supported.
        if (filesInError) {
            files = files.filter(file => {
                return !filesInError.includes(file.name)
            })
        }
        // filter out the files already in state, so as to avoid duplicate entry, when validation changes.
        files = files.filter(file => {
            return !this.state.files.includes(file)
        })
        this.setState(prevState => ({
            files: prevState.files.concat(files)
        }));
    }

    /**
     * uploadFiles function, that will execute promise for each file.
     */
    async uploadFiles() {
        this.setState({ uploadProgress: {}, uploading: true })
        const promises = []
        this.state.files.forEach(file => {
            promises.push(this.sendRequest(file));
        });
        try {
            await Promise.all(promises)

            this.setState({ successfullUploaded: true, uploading: false })
        } catch (e) {
            this.setState({ error: 'Server Error!' });
        }
    }

    /**
     * 
     * @param {*} file Making the post request to the server, that stores the files in upload folder.
     */
    sendRequest(file) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            req.upload.addEventListener("progress", event => {
                if (event.lengthComputable) {
                    const copy = { ...this.state.uploadProgress }
                    copy[file.name] = {
                        state: "pending",
                        percentage: (event.loaded / event.total) * 100
                    };
                    this.setState({ uploadProgress: copy })
                }
            });

            req.upload.addEventListener("load", event => {
                const copy = { ...this.state.uploadProgress };
                copy[file.name] = { state: "done", percentage: 100 }
                this.setState({ uploadProgress: copy })
                resolve(req.response)
            });

            req.upload.addEventListener("error", event => {
                const copy = { ...this.state.uploadProgress }
                copy[file.name] = { state: "error", percentage: 0 }
                this.setState({ uploadProgress: copy })
                reject(req.response)
            });

            const formData = new FormData();
            formData.append("file", file)

            req.open("POST", "http://localhost:8080/api/upload")
            req.send(formData);
        });
    }

    /**
     * 
     * @param {*} file File for which the progress, has to be rendered.
     */
    renderProgress(file) {
        const uploadProgress = this.state.uploadProgress[file.name]
        if (this.state.uploading || this.state.successfullUploaded) {
            return (
                <div className="progressWrapper">
                    <Progress progress={uploadProgress ? uploadProgress.percentage : 0} state={uploadProgress ? uploadProgress.state : "done"}/>
                    <img
                        className="checkIcon"
                        alt="done"
                        src="static/svgs/baseline-check_circle-24px.svg"
                        style={{
                            opacity:
                                uploadProgress && uploadProgress.state === "done" ? 1 : 0
                        }}
                    />
                </div>
            );
        }
    }

    /**
     * Action Renderer, Upload when their is no error, & clear uploads when their is some error.
     */
    renderActions() {
        if (this.state.successfullUploaded) {
            return (
                <button
                    onClick={() =>
                        this.setState({ files: [], successfullUploaded: false })
                    }
                >
                    Clear
      </button>
            );
        } else {
            return (
                <button
                    disabled={this.state.files.length < 0 || this.state.uploading || this.state.error}
                    onClick={this.uploadFiles}
                >
                    Upload
                </button>
            );
        }
    }

    /**
     * 
     * @param {*} value List of extensions, that are selected.
     */
    selectExtension(value) {
        this.setState({ allowedFileExtensions: value }, () => {
            const { extensionNotSupported, filesInError } = this.validateExtension(this.state.files)
            if (extensionNotSupported.length) {
                this.onError(extensionNotSupported)
            } else {
                this.onError()
            }
            this.onFilesAdded(this.state.files)
        })
    }

    /**
     * 
     * @param {*} list list of files, that have to be checked for validation.
     * @returns {extensionsNotSupported, filesInError} List of extensions that are not supported, & list of file names that are in error.
     */
    validateExtension(list) {
        const extensionNotSupported = []
        const filesInError = []
        // regex for extracting out the extension from file.
        const patternFileExtension = /\.([0-9a-z]+)(?:[\?#]|$)/i
        for (let i = 0; i < list.length; i++) {
            const name = list[i].name
            const ext = (name).match(patternFileExtension)[1]
            const { allowedFileExtensions } = this.state
            let matched = false
            if (allowedFileExtensions && allowedFileExtensions.length > 0) {
                allowedFileExtensions.forEach((extension) => {
                    if (extension.name.toLowerCase() === ext) {
                        matched = true
                    }
                })
                if (!matched) {
                    if (!extensionNotSupported.includes(ext)) {
                        filesInError.push(name)
                        extensionNotSupported.push(ext)
                    }
                }
            }
        }
        return {extensionNotSupported, filesInError}
    }

    /**
     * 
     * @param {*} extensions [] of the not allowed extensions
     */
    onError(extensions = []) {
        if (extensions.length) {
            let errorMessage = 'File of type '
            extensions.forEach((extension, idx) => {
                errorMessage  += extension
                if (idx != extensions.length -1) {
                    errorMessage += ', '
                }
            })
            errorMessage += ' is not supported!!'
            this.setState({ error: errorMessage })
        } else {
            this.setState({ error: null })
        }
    }

    render() {
        return (
            <div className="upload">
                {this.state.error ? (
                    <div className="errorMessage">{this.state.error}</div>
                ) : null}
                <span className="title">File Uploader</span>
                <span className="extensions">
                    Allowed Extensions: 
                    <Picky 
                        value={this.state.allowedFileExtensions}
                        options={fileExtensions}
                        onChange={this.selectExtension}
                        valueKey="name"
                        labelKey="name"
                        multiple={true}
                        includeFilter={true}
                        dropdownHeight={150}
                    />
                </span>
                <div className="content">
                    <div>
                        <Selector
                            onFilesAdded={this.onFilesAdded}
                            disabled={this.state.uploading || this.state.successfullUploaded}
                            allowedExtensions={this.state.allowedFileExtensions}
                        />
                    </div>
                    <div className="files">
                        {this.state.files.map(file => {
                            return (
                                <div key={file.name} className="row">
                                    <span className="filename">{file.name}</span>
                                    {this.renderProgress(file)}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="actions">{this.renderActions()}</div>
            </div>
        );
    }
}