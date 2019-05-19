;(function(){ //class Main
/* 
constructor
    
private CONST - number
private fields_relationship_list - obj
private isRealyNaN(number x)
private toInt(string str)

public init()    
public change_input(string input_id)
public check_sum
*/
    var Main = function() { //constructor
        return this;
    };
    
//private methods/properties----------------------------------------------------

    var CONST = 50; //константа из ТЗ для формул
    var _this = {}; //реализация private свойств/методов
    
    //id-элемента : массив отношений [0 => 'id'-элемента,1 => нужная сумма полей]
    _this.fields_relationship_list = { //список отношений между полями
        'u1' : [
            ['u1-5', 500],
        ],
        'u1-5' : [
            ['u1', 500],
        ],
        'u5' : [
            ['u2c', 1000],
            ['u2b', 800],
            ['u2a', 2900],
        ],
        'u2a' : [
            ['u5', 2900],
        ],
        'u2b' : [
            ['u5', 800],
        ],
        'u2c' :  [
            ['u5', 1000],
        ],
    };
    
    //help functions------------------------------------------------------------
    _this.isRealyNaN = function (x) {
        return x !== x;
    };
    _this.toInt = function(str) {
        var int = parseInt(str, 10);
        if (_this.isRealyNaN(int)) return 0;
        return int;
    };
    //------------------------------------------------------------help functions
    
//----------------------------------------------------private methods/properties

//public methods/properties-----------------------------------------------------

    //устанавливает значения по дефолту 
    Main.prototype.init = function() {
        for (var key in _this.fields_relationship_list) {
            this.change_input(key);
        }
    };
    //меняет поле и другие поля связанные с ним, отношения прописаны в свойстве
    //fields_relationship_list, принимает 1 параметр, id поля, которе изменилось
    Main.prototype.change_input = function(input_id) {
        var $inpt1, $inpt2, dependents, total;
        //возвращает true, если поля были изменены, false - елси поле не были изменены
        //(елси сумма их значений равна нужной сумме между ними, суммы взяты из ТЗ
        var change_values = function() {
            var $v1, $v2;
            $v1 = _this.toInt($inpt1.val());
            $v2 = _this.toInt($inpt2.val());
            
            if (total === $v1+$v2) return false;
            
            switch (true) {
                case $v1 < 0 || $v2 < 0 || $v1+$v2 < 0 :
                    $inpt2.val(total);
                    $inpt1.val('');
                    return true;
                case $v1+$v2 < total :
                    $inpt2.val($v2+(total-($v1+$v2)));
                    return true;
                case $v1+$v2 > total :
                    if ($v1 > total) {
                        $inpt1.val(total);
                        $inpt2.val('');
                    } else {
                        $inpt2.val($v2-(($v1+$v2)-total));
                    }
                    return true;
                case $v1+$v2 <= 0 :
                    $inpt2.val(total);
                    $inpt1.val('');
                    return true;
            }
        };
        
        $inpt1 = $('#' +input_id);
        dependents = _this.fields_relationship_list[input_id];
        dependents.sort((a,b)=> a[1]>b[1]);
        
        for (var i = 0;i < dependents.length; i++) {
            $inpt2 = $('#' +dependents[i][0]);
            total = dependents[i][1];
            if (change_values() ) this.change_input(dependents[i][0]);
        }
    }
    //возвращает массив, со значениями высчитаными по формулам их ТЗ
    Main.prototype.check_sum = function() {
        var u1_u15, u2a, u2b, u2c, u5, res_ar;
        u1_u15 = _this.toInt($('#u1').val()) + _this.toInt($('#u1-5').val());//u1 + u1.5
        u2a = _this.toInt($('#u2a').val());
        u2b = _this.toInt($('#u2b').val());
        u2c = _this.toInt($('#u2c').val());
        u5 = _this.toInt($('#u5').val());
        res_ar = [];
        
        res_ar.push(u1_u15 + (u5 + u2a) + CONST); //end value 1
        res_ar.push(u1_u15 + (u5 + u2b) + CONST); //end value 2
        res_ar.push(u1_u15 + (u5 + u2c) + CONST); //end value 3
        
        return res_ar;
    }
    
//----------------------------------------------------public methods/properties
    window.Main = Main;
})();

//Обработчики событий
$(document).ready(function(){ 
    var main = new Main();
    main.init();
    
    //запрещает ввод любых символов, кроме 1-9
    $('#u1, #u1-5, #u2a, #u2b, #u2c, #u5').on('keyup input', function() {
        if (this.value.match(/[^0-9]/g)) {
            this.value = this.value.replace(/[^0-9]/g, '');
            return false;
        }
        //обработавает новое значение поля,
        //если больше положеного - устанавливает текущие поле в максимальное
        //(значения из ТЗ)
        //(U1 + U1.5) = 500
        //(U5 + U2а) = 2900
        //(U5 + U2b) = 800
        //(U5 + U2c) = 1000
        //если меньше - добавляет разницу между необходимым числом и текущей суммой 
        //двух связанных полей, во второе(связанное поле)
        main.change_input($(this).attr('id'));
    });
    
    //считает рез-ты по заданым формулам и добавляет результаты в контейнер
    //под кнопокой CHECK
    $('#check-btn').on('click', function(){
        var res_ar = main.check_sum();
        var $cont = $('#end-values-container').empty();
        for (var i = 0; i < res_ar.length; ++i) {
            $cont.append('<div>\n\
                <span>конечное значение №' +(i+1)+ '</span>\n\
                <br>' +res_ar[i]+ '\
            </div>')
        }       
    });
});
