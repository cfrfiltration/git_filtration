from django import forms

#from .models import Value_List

class ValueForm(forms.Form):
    particleDiameter1 = forms.DecimalField()
    particleDiameter2 = forms.DecimalField()
    particlePerm = forms.DecimalField()
    chargeInput = forms.DecimalField()
    temperature = forms.DecimalField()
    pressure = forms.DecimalField()
    humidity = forms.DecimalField()
    velocity = forms.DecimalField()
    solidity = forms.DecimalField()
    fiberDiameter = forms.DecimalField()
    fiberPerm = forms.DecimalField()
    chargeDensity = forms.DecimalField()
    
    permittivitySelect = forms.ChoiceField()
    particleCharge = forms.ChoiceField()
    temperatureUnits = forms.ChoiceField()
    pressureUnits = forms.ChoiceField()
    velocityUnits = forms.ChoiceField()
    permSelect = forms.ChoiceField()
    thicknessUnits = forms.ChoiceField()
    densitySelect = forms.ChoiceField()
    
    myfile = forms.FileField()
    
    #file = forms.CommaSeparatedDecimalField(max_length=200)
    

    #class Meta:
        #model = Value_List


    