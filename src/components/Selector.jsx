import React from 'react'
import './selector.css'

export default class Selector extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { 
            hightlight: false,
        }
        this.fileInputRef = React.createRef()

        this.openFileDialog = this.openFileDialog.bind(this)
        this.onFilesAdded = this.onFilesAdded.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.onDragLeave = this.onDragLeave.bind(this)
        this.onDrop = this.onDrop.bind(this)
    }

    /**
     * opens the File Input Ref.
     */
    openFileDialog() {
        if (this.props.disabled) return
        this.fileInputRef.current.click()
    }

    /**
     * 
     * @param {*} evt Executed when the file is selected. 
     */
    onFilesAdded(evt) {
        if (this.props.disabled) return
        const files = evt.target.files
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files)
            this.props.onFilesAdded(array)
        }
    }

    onDragOver(evt) {
        evt.preventDefault()

        if (this.props.disabled) return

        this.setState({ hightlight: true })
    }

    onDragLeave() {
        this.setState({ hightlight: false })
    }

    onDrop(event) {
        event.preventDefault()

        if (this.props.disabled) return

        const files = event.dataTransfer.files
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files)
            this.props.onFilesAdded(array)
        }
        this.setState({ hightlight: false })
    }

    /**
     * 
     * @param {*} list converts the files, that we get in the list.
     * @returns list of the files. 
     */
    fileListToArray(list) {
        const array = []
        for (let i = 0; i < list.length; i++) {
            array.push(list.item(i))
        }
        return array
    }

    render() {
        return (
            <div
                className={`selector ${this.state.hightlight ? 'highlight' : ''}`}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}
                onClick={this.openFileDialog}
                style={{ cursor: this.props.disabled ? 'default' : 'pointer' }}
            >
                <input
                    ref={this.fileInputRef}
                    className="fileInput"
                    type="file"
                    multiple
                    onChange={this.onFilesAdded}
                />
                <img
                    alt="upload"
                    className="icon"
                    src="static/svgs/outline-cloud_upload-24px.svg"
                />
                <span>Upload File</span>
            </div>
        )
    }
}