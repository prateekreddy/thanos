module.exports = {
    inputSanitate : function(data,checks){
        for (let index = 0; index < checks.length; index++) {
            if(!data[checks[index]]){
                return false
            }
        }
        return true;
    }
}