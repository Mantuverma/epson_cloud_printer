// src/xmlHelper.ts
import { create } from "xmlbuilder";

/**
 * Generate XML for a print job, replacing placeholders with dynamic data.
 * @param serial The printer serial number to be included in the receipt.
 */
export const generatePrintXML = (serial: string): string => {
  const xml = create("PrintRequestInfo")
    .ele("ePOSPrint")
    .ele("Parameter")
    .ele("devid", "local_printer")
    .up()
    .ele("timeout", "10000")
    .up()
    .up() // Close Parameter
    .ele("PrintData")
    .ele("epos-print", {
      xmlns: "http://www.epson-pos.com/schemas/2011/03/epos-print",
    })
    .ele("text", { lang: "en" })
    .up()
    .ele("text", { smooth: "true" })
    .up()
    .ele("text", { align: "center" })
    .up()
    .ele("text", { font: "font_b" })
    .up()
    .ele("text", { width: "2", height: "2" })
    .up()
    .ele("text", {
      reverse: "false",
      ul: "false",
      em: "true",
      color: "color_1",
    })
    .up()
    .ele("text", {}, `Printer Serial: ${serial}&#10;`)
    .up()
    .ele("text", {}, "DELIVERY TICKET&#10;")
    .up()
    .ele("feed", { unit: "12" })
    .up()
    .ele("text", {}, "&#10;")
    .up()
    .ele("text", { align: "left" })
    .up()
    .ele("text", { font: "font_a" })
    .up()
    .ele("text", { width: "1", height: "1" })
    .up()
    .ele("text", {
      reverse: "false",
      ul: "false",
      em: "false",
      color: "color_1",
    })
    .up()
    .ele("text", {}, "Order&#9;0001&#10;")
    .up()
    .ele("text", {}, "Time&#9;Mar 19 2013 13:53:15&#10;")
    .up()
    .ele("text", {}, "Seat&#9;A-3&#10;")
    .up()
    .ele("text", {}, "&#10;")
    .up()
    .ele("text", {}, "Alt Beer&#10;")
    .up()
    .ele("text", {}, "&#9;$6.00  x  2")
    .up()
    .ele("text", { x: "384" })
    .up()
    .ele("text", {}, "    $12.00&#10;")
    .up()
    .ele("text", {
      reverse: "false",
      ul: "false",
      em: "true",
      width: "2",
      height: "1",
    })
    .up()
    .ele("text", {}, "TOTAL")
    .up()
    .ele("text", { x: "264" })
    .up()
    .ele("text", {}, "    $12.00&#10;")
    .up()
    .ele("feed", { unit: "12" })
    .up()
    .ele("text", { align: "center" })
    .up()
    .ele(
      "barcode",
      { type: "code39", hri: "none", font: "font_a", width: "2", height: "60" },
      "0001"
    )
    .up()
    .ele("feed", { line: "3" })
    .up()
    .ele("cut", { type: "feed" })
    .up()
    .up() // Close epos-print
    .up() // Close PrintData
    .up() // Close ePOSPrint
    .up(); // Close PrintRequestInfo

  return xml.end({ pretty: true });
};
