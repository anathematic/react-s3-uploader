"use strict";

var React = require('react'),
    S3Upload = require('./s3upload.js'),
    objectAssign = require('object-assign');

var ReactS3Uploader = React.createClass({

    propTypes: {
        signingUrl: React.PropTypes.string.isRequired,
        onProgress: React.PropTypes.func,
        onFinish: React.PropTypes.func,
        onError: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            onProgress: function(percent, message) {
                console.log('Upload progress: ' + percent + '% ' + message);
            },
            onFinish: function(signResult) {
                console.log("Upload finished: " + signResult.publicUrl)
            },
            onUpdateElement: function(width, height) {
                console.log("Element sizing: ", width, "px wide, ", height, "px high");
            },
            onError: function(message) {
                console.log("Upload error: " + message);
            }
        };
    },

    uploadFile: function() {
        var self = this;
        var file = this.getDOMNode().files[0];
        var reader = new FileReader();
        var image = new Image();
        var width;
        var height;

        reader.readAsDataURL(file)

        reader.onload = function(_file) {
          image.src = _file.target.result;

          image.onload = function() {
            width = this.width
            height = this.height

            self.props.onUpdateElement({width: width, height: height});
          }
        }

        new S3Upload({
            fileElement: this.getDOMNode(),
            signingUrl: this.props.signingUrl,
            onProgress: this.props.onProgress,
            onFinishS3Put: this.props.onFinish,
            onError: this.props.onError
        });
    },

    render: function() {
        return React.DOM.input(objectAssign({}, this.props, {type: 'file', onChange: this.uploadFile}));
    }

});


module.exports = ReactS3Uploader;
