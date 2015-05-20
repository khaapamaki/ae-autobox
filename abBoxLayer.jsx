// AutoBox 0.1.2 beta
// Expressions for Box Layer
// Kati Haapamäki 2015


// ***********************************************************************************************
// ***********************************************************************************************
// ***
// ***         BOX LAYER (EG. SOLID)
// ***
// ***********************************************************************************************
// ***********************************************************************************************


// ***** ANCHOR POINT *****

// AutoBox 0.1.2
// IMITATE PARENT'S ANCHORPOINT MOVEMENT AND DO ADJUSTMENTS NEEDED FOR BORDERS
try {
    // Get Parent Layer Properties
	parentLayer = effect("Parent Text Layer")("Layer");
    
    // Read Expression Control Values
    anchorPositionX = parentLayer.effect("Horizontal Alignment")("Slider");
    anchorPositionY = parentLayer.effect("Vertical Alignment")("Slider");
    
    // Read Expression Control Values
    borderTop = effect("Border Top")("Slider");
    borderBottom = effect("Border Bottom")("Slider");
    borderLeft = effect("Border Left")("Slider");
    borderRight = effect("Border Right")("Slider");
    
    // Get Parent Layer Properties
    refTimeX = parentLayer.effect("Reference Time")("Slider");
    refTimeY = parentLayer.effect("Uniform Reference Time")("Checkbox")==false ? 
        parentLayer.effect("Reference Time For Height")("Slider") 
        : parentLayer.effect("Reference Time")("Slider");
    textLeft = parentLayer.sourceRectAtTime(refTimeX).left;
    textTop = parentLayer.sourceRectAtTime(refTimeY).top;
    textWidth = parentLayer.sourceRectAtTime(refTimeX).width;
    textHeight = parentLayer.sourceRectAtTime(refTimeY).height;
    textScale = parentLayer.scale / 100;
    
    // Get My Properties
    myWidth = thisLayer.width;
    myHeight = thisLayer.height;
    myScale = thisLayer.scale / 100;
    
    // Override anchor setting to use text's base line for vertical anchor
    // -> convert anchorPosition param for text coordinates to box coordinates
    // -> will be equal to texts Y anchor=0
    if (parentLayer.effect("Vertical Anchor At Base Line")("Checkbox") == true) {
        anchorPositionY = -textTop / textHeight * 2.0 - 1.0; 
    }   
	
    // Do The Math
    // yTemp, xTemp: coordinate conversion from text space to box space
    if (effect("Relative Border Size")("Checkbox") == true) {
        xTemp = myScale[0] == 0 ? 0 : textScale[0] / myScale[0] ;
        yTemp = myScale[1] == 0 ? 0 : textScale[1] / myScale[1] ;
    } else {
        xTemp = myScale[0] == 0 ? 0 : 1 / myScale[0] ;
        yTemp = myScale[1] == 0 ? 0 : 1 / myScale[1]; 
    }
    
    try {
        // handles border alignment to another box layer than me
        siblingLayer = parentLayer.effect("Alignment Uses Layer")("Layer");

        if (siblingLayer.name != thisLayer.name) {
            // Align with another box layer
            sBorderTop = siblingLayer.effect("Border Top")("Slider");
            sBorderBottom = siblingLayer.effect("Border Bottom")("Slider");
            sBorderLeft = siblingLayer.effect("Border Left")("Slider");
            sBorderRight = siblingLayer.effect("Border Right")("Slider");
            
            borderCorrectionX = (borderLeft-sBorderLeft) * (anchorPositionX - 1.0) / 2 
                + (borderRight-sBorderRight) * (anchorPositionX + 1.0) / 2;
            if (parentLayer.effect("Vertical Anchor At Base Line")("Checkbox") == false) {
                borderCorrectionY = (borderTop-sBorderTop) * (anchorPositionY - 1.0) / 2 
                    + (borderBottom-sBorderBottom) * (anchorPositionY + 1.0) / 2;
            } else {
                borderCorrectionY = borderTop * (anchorPositionY - 1.0) / 2 + borderBottom * (anchorPositionY + 1.0) / 2;
            }

            anchorX = thisLayer.width * (1.0 + anchorPositionX) / 2;
            anchorY = thisLayer.height * (1.0 + anchorPositionY) / 2; 
            anchorX -= borderCorrectionX * xTemp;   
            anchorY -= borderCorrectionY * yTemp;

        } else {
            // align with me
            anchorX = thisLayer.width * (1.0 + anchorPositionX) / 2;
            anchorY = thisLayer.height * (1.0 + anchorPositionY) / 2;
            if (parentLayer.effect("Vertical Anchor At Base Line")("Checkbox") == true) {
                borderCorrectionY = borderTop * (anchorPositionY - 1.0) / 2 + borderBottom * (anchorPositionY + 1.0) / 2;
                anchorY -= borderCorrectionY * yTemp;
            }   
        }
    }
    catch(err) {
        // align with text layer
        anchorX = thisLayer.width * (1.0 + anchorPositionX) / 2;
        anchorY = thisLayer.height * (1.0 + anchorPositionY) / 2; 
        // balance for uneven borders
        borderCorrectionX = borderLeft * (anchorPositionX - 1.0) / 2 + borderRight * (anchorPositionX + 1.0) / 2;
        borderCorrectionY = borderTop * (anchorPositionY - 1.0) / 2 + borderBottom * (anchorPositionY + 1.0) / 2;
        anchorX -= borderCorrectionX * xTemp;
        anchorY -= borderCorrectionY * yTemp;
    }
    
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
    [thisLayer.width/2, thisLayer.height/2];
}


// ***** POSITION *****

// AutoBox 0.1.2
// MIRROR PARENT POSITION
try {
    // Get Parent Layer Properties
	parentLayer = effect("Parent Text Layer")("Layer");
    
    // Get Parent Layer Properties
    textPosition = parentLayer.transform.position

    // Result
    try {
        [textPosition[0], textPosition[1], transform.position[2]];  // 3D-layer
    }
    catch(err) {
        [textPosition[0], textPosition[1]];  // 2D-layer
    }
}
catch(err) {
    // Result on expression error    
    [thisComp.width/2, thisComp.height/2];
}


// ***** SCALE *****

// AutoBox 0.1.2
// SCALE TO MATCH PARENT SIZE
try {
    // Get Parent Name
    parentLayer = effect("Parent Text Layer")("Layer");
	
    // Read Expression Control Values
    borderTop = effect("Border Top")("Slider");
    borderBottom =  effect("Border Bottom")("Slider");
    borderLeft =  effect("Border Left")("Slider");
    borderRight =  effect("Border Right")("Slider");
    minHeight = effect("Min Height")("Slider");
    minWidth = effect("Min Width")("Slider");
    maxHeight = effect("Max Height")("Slider");
    maxWidth = effect("Max Width")("Slider");

    // Get Parent Layer Properties
    parentLayer = effect("Parent Text Layer")("Layer");
    refTimeX = parentLayer.effect("Reference Time")("Slider");
    refTimeY = parentLayer.effect("Uniform Reference Time")("Checkbox")==false ? 
        parentLayer.effect("Reference Time For Height")("Slider") 
        : parentLayer.effect("Reference Time")("Slider");
    textHeight = parentLayer.sourceRectAtTime(refTimeY).height;
    textTop = parentLayer.sourceRectAtTime(refTimeY).top;
    textWidth = parentLayer.sourceRectAtTime(refTimeX).width;
    textLeft = parentLayer.sourceRectAtTime(refTimeX).left;
    textScale = parentLayer.transform.scale / 100;
    
    // Do The Math
    minScaleX = minWidth / thisLayer.width;
    minScaleY = minHeight / thisLayer.height;
    maxScaleX = maxWidth / thisLayer.width;
    maxScaleY = maxHeight / thisLayer.height;
    
    // Scale from parent's size + borders
    scaleX = textWidth / thisLayer.width * textScale[0];
    scaleY = textHeight  / thisLayer.height * textScale[1];

    if (effect("Relative Border Size")("Checkbox") == true) {
        scaleX += (borderLeft + borderRight) / thisLayer.width * textScale[0];
        scaleY += (borderTop+ borderBottom) / thisLayer.height * textScale[1];
    }
    else {
        scaleX += (borderLeft + borderRight) / thisLayer.width;
        scaleY += (borderTop + borderBottom) / thisLayer.height;
    }

    // Limit to max size
    scaleX = scaleX > maxScaleX && maxWidth > 0 ? maxScaleX : scaleX;
    scaleY = scaleY > maxScaleY  && maxHeight > 0 ? maxScaleY : scaleY;
    // Enlarge to min size
    scaleX = scaleX < minScaleX ? minScaleX : scaleX;
    scaleY = scaleY < minScaleY ? minScaleY : scaleY;
  
    // Result
    [scaleX, scaleY] * 100;
}
catch(err) {
    // Result on expression error
    [100, 100];
}


// ***** ORIENTATION *****

// AutoBox 0.1.2
// MIRROR ORIENTATION FROM PARENT
try {
    // Get Parent Name
    parentLayer = effect("Parent Text Layer")("Layer");

    // Result
    parentLayer.transform.orientation;
}
catch(err) {
    // Result on expression error
    [0, 0, 0];
}


// ***** X ROTATION *****

// AutoBox 0.1.2
// MIRROR X ROTATION FROM PARENT
try {
    // Get Parent Name
    parentLayer = effect("Parent Text Layer")("Layer");

    // Result
    parentLayer.transform.xRotation;
}
catch(err) {
    // Result on expression error
    0;
} 


// ***** Y ROTATION *****

// AutoBox 0.1.2
// MIRROR Y ROTATION FROM PARENT
try {
    // Get Parent Name
    parentLayer = effect("Parent Text Layer")("Layer");

    // Result
    parentLayer.transform.yRotation;
}
catch(err) {
    // Result on expression error
    0;
}  


// ***** ROTATION / Z ROTATION *****

// AutoBox 0.1.2
// MIRROR ROTATION/Z ROTATION FORM PARENT
try {
    // Get Parent Name
    parentLayer = effect("Parent Text Layer")("Layer");

    // Result
    parentLayer.transform.rotation;
}
catch(err) {
    // Result on expression error
    0;
}

// *******************************************************************************
// ***************************** SECONDARY TRANSFORM *****************************
// *******************************************************************************


// ***** EFFECT: TRANSFORM > ANCHOR POINT *****

// AutoBox 0.1.2
// SECONDARY ANCHORPOINT ALIGNEMENT
try {
    // Read Expression Control Values
    anchorPositionX = effect("Secondary Horizontal Alignment")("Slider");
    anchorPositionY = effect("Secondary Vertical Alignment")("Slider");
    
    // Do The Math
    anchorX = thisLayer.width  * (anchorPositionX + 1.0) / 2.0;
    anchorY = thisLayer.height * (anchorPositionY + 1.0) / 2.0;
    
    // Result
    [anchorX, anchorY];
}
catch(err) {
    // Result on expression error
    [0, 0];
}


// ***** EFFECT: TRANSFORM > POSITION *****

// AutoBox 0.1.2
// ADAPT SECONDARY POSITION TO SECONDARY ANCHORPOINT MOVEMENT
try {
    effect("Secondary Transform")("Anchor Point")
}
catch(err) {
    // Result on expression error
    [0, 0];
}

// ***** EFFECT: TRANSFORM > SCALE HEIGHT *****

// AutoBox 0.1.2
// SECONDARY SCALE HEIGHT - FOR EXPRESSION CONTROL USAGE
try {
    effect("Secondary Uniform Scale")("Slider") * effect("Secondary Y Scale")("Slider") / 100;
}
catch(err) {
    // Result on expression error
    100;
}

// ***** EFFECT: TRANSFORM > SCALE WIDTH *****

// AutoBox 0.1.2
// SECONDARY SCALE WIDTH - UFOR EXPRESSION CONTROL USAGE
try {
    effect("Secondary Uniform Scale")("Slider") * effect("Secondary X Scale")("Slider") / 100;
}
catch(err) {
    // Result on expression error
    100;
}


