function calc() {
    let c = 1;
    let a = $("#EQ1-f" + c + "-1").val();
    let b = $("#EQ1-f2-1").val()
    
    let text = a + ", " + b;
    $("#output").text(text);
}
