// AutoBox 0.1.2 beta
// Expressions for Text Layer
// Kati Haapamäki 2015


// ***********************************************************************************************
// ***********************************************************************************************
// ***
// ***         TEXT LAYER
// ***
// ***********************************************************************************************
// ***********************************************************************************************


// ***** ANCHOR POINT *****

// AutoBox 0.1.2
// ANCHORPOINT ALIGNMENT - TOP=-1.0, BOTTOM=1.0, CENTER=0, LEFT=-1.0 OR RIGHT=1.0
try {
    // Read Expression Control Values
    anchorPositionX = effect("Horizontal Alignment")("Slider");
    anchorPositionY = effect("Vertical Alignment")("Slider");
    refTimeX = effect("Reference Time")("Slider");
    refTimeY = effect("Uniform Reference Time")("Checkbox")==false ? 
        effect("Reference Time For Height")("Slider") : effect("Reference Time")("Slider");
    // Get Layer Properties
    textLeft = thisLayer.sourceRectAtTime(refTimeX).left;
    textTop = thisLayer.sourceRectAtTime(refTimeY).top;   
    textWidth = thisLayer.sourceRectAtTime(refTimeX).width;
    textHeight = thisLayer.sourceRectAtTime(refTimeY).height;
    
    try {
        // Get child parameters when alignments are set use them
		childLayer = effect("Alignment Uses Layer")("Layer");
        if (childLayer) {
            borderTop = childLayer.effect("Border Top")("Slider");
            borderBottom = childLayer.effect("Border Bottom")("Slider");
            borderLeft = childLayer.effect("Border Left")("Slider");
            borderRight = childLayer.effect("Border Right")("Slider");
            alignUsesChildLayer = true;
        } else {
            alignUsesChildLayer = false;
        }
    }
    catch(err) {
        alignUsesChildLayer = false;
    }
    
    // Do The Math
    if (alignUsesChildLayer) {
        anchorX = textLeft + textWidth * (anchorPositionX + 1.0) / 2;
        anchorY = textTop + textHeight * (anchorPositionY + 1.0) / 2;
        borderCorrectionX = borderLeft * (anchorPositionX - 1.0) / 2 + borderRight * (anchorPositionX + 1.0) / 2;
        borderCorrectionY = borderTop * (anchorPositionY - 1.0) / 2 + borderBottom * (anchorPositionY + 1.0) / 2;
        if (childLayer.effect("Relative Border Size")("Checkbox") == false) {
            anchorX +=borderCorrectionX / (scale[0] / 100);
            anchorY +=borderCorrectionY / (scale[1] / 100);
        } else {
         	anchorX +=borderCorrectionX;
        	anchorY +=borderCorrectionY;
        }
    } else {
        anchorX = textLeft + textWidth * (anchorPositionX + 1.0) / 2;
        anchorY = textTop + textHeight * (anchorPositionY + 1.0) / 2;
    }
    
    // Override anchor setting to use text's base line for vertical anchor
	if (effect("Vertical Anchor At Base Line")("Checkbox") == true)
		anchorY = 0;
    
    // Result
    try {
        [anchorX, anchorY, transform.anchorPoint[2]];  // 3D-layer
    }
    catch(err) {
        [anchorX, anchorY];  // 2D-layer
    }
}
catch(err) {
    // Result on expression error
    transform.anchorPoint;
}


// ***** SCALE *****

// AutoBox 0.1.2
// SCALE - SIZE LIMITTER
try {
    // Read Expression Control Values
    refTimeX = effect("Reference Time")("Slider");
    refTimeY = effect("Uniform Reference Time")("Checkbox")==false ? 
        effect("Reference Time For Height")("Slider") : effect("Reference Time")("Slider");
    maxWidth = effect("Max Width")("Slider");
    maxHeight = effect("Max Height")("Slider");
    useActualSizeForLimiting = effect("Relative Max Size")("Checkbox") == false;

    try {
        // If max size is set to be taken from the child (box)
		childLayer = effect("Get Max Size From Layer")("Layer");
		maxWidth = childLayer.effect("Max Width")("Slider")
            - childLayer.effect("Border Left")("Slider") - childLayer.effect("Border Right")("Slider");
		maxHeight = childLayer.effect("Max Height")("Slider")
            - childLayer.effect("Border Top")("Slider") - childLayer.effect("Border Bottom")("Slider");
		maxWidth = maxWidth < 0 ? 0 : maxWidth;
		maxHeight = maxHeight < 0 ? 0 : maxHeight;
	}
	catch(err) {
        // ..if not (failed above), use this layer's settings
        maxWidth = effect("Max Width")("Slider");
		maxHeight = effect("Max Height")("Slider");
	}

    // Get Layer Properties
    scaleForLimitingAfterScaleX = useActualSizeForLimiting ? transform.scale[0] / 100 : 1;
    scaleForLimitingAfterScaleY = useActualSizeForLimiting ? transform.scale[1] / 100 : 1;
    textLeft = thisLayer.sourceRectAtTime(refTimeX).left;
    textWidth = thisLayer.sourceRectAtTime(refTimeX).width * scaleForLimitingAfterScaleX;
    textTop = thisLayer.sourceRectAtTime(refTimeY).top;
    textHeight = thisLayer.sourceRectAtTime(refTimeY).height * scaleForLimitingAfterScaleY;
    
    // Do The Math
    maxScaleByWidth = textWidth > maxWidth && maxWidth > 0 ? maxWidth / textWidth : 1;
    maxScaleByHeight = textHeight > maxHeight && maxHeight > 0 ? maxHeight / textHeight : 1;
    scaleXY = maxScaleByHeight < maxScaleByWidth ? maxScaleByHeight : maxScaleByWidth;
    // Result
    transform.scale * scaleXY;
}
catch(err) {
    // Result on expression error
    transform.scale;
}

// *******************************************************************************
// ***************************** SECONDARY TRANSFORM *****************************
// *******************************************************************************

// ***** EFFECT: TRANSFORM > ANCHOR POINT *****

// AutoBox 0.1.2
// ANCHORPOINT ALIGNMENT - TOP=-1.0, BOTTOM=1.0, CENTER=0, LEFT=-1.0 OR RIGHT=1.0
try {
    // Read Expression Control Values
    anchorPositionX = effect("Secondary Horizontal Alignment")("Slider");
    anchorPositionY = effect("Secondary Vertical Alignment")("Slider");
    refTimeX = effect("Reference Time")("Slider");
    refTimeY = effect("Uniform Reference Time")("Checkbox")==false ? 
        effect("Reference Time For Height")("Slider") : effect("Reference Time")("Slider");

    // Get Layer Properties
    textPositionX = transform.position[0];
    textPositionY = transform.position[1];
    textHeight = thisLayer.sourceRectAtTime(refTimeY).height;
    textWidth = thisLayer.sourceRectAtTime(refTimeX).width;
    textScaleX = transform.scale[0] / 100;
    textScaleY = transform.scale[1] / 100;
    
    // Do The Math
    anchorX = textPositionX + textWidth * textScaleX * anchorPositionX / 2.0;
    anchorY = textPositionY + textHeight * textScaleY * anchorPositionY / 2.0;
    
    // Result
    [anchorX, anchorY];
}
catch(err) {
    // Result on expression error
    [0, 0];
}


// ***** EFFECT: TRANSFORM > POSITION *****

// AutoBox 0.1.2
// ADAPT POSITION TO ANCHORPOINT MOVEMENT
try {
    effect("Secondary Transform")("Anchor Point")
}
catch(err) {
    // Result on expression error
    [0, 0];
}

// ***** EFFECT: TRANSFORM > SCALE HEIGHT *****

// AutoBox 0.1.2
// SCALE HEIGHT - USE EXPRESSION CONTROLS FOR CONVENIENCE
try {
    effect("Secondary Uniform Scale")("Slider") * effect("Secondary Y Scale")("Slider") / 100;
}
catch(err) {
    // Result on expression error
    100;
}

// ***** EFFECT: TRANSFORM > SCALE WIDTH *****

// AutoBox 0.1.2
// SCALE WIDTH - USE EXPRESSION CONTROLS FOR CONVENIENCE
try {
    effect("Secondary Uniform Scale")("Slider") * effect("Secondary X Scale")("Slider") / 100;
}
catch(err) {
    // Result on expression error
    100;
}

