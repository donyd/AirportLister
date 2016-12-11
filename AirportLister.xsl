<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">   <!--defines that this document is an XSLT style sheet document-->
<xsl:template match="/">  <!--this attribute associates the template with the root of the XML source document-->
    <!-- <h2>Airport Information</h2> -->
    <table border="2">
      <tr bgcolor="ffdd33">
        <th>Airport Code</th>
        <th>Name</th>
        <th>City</th>
        <th>Country</th>
        <th>Continent</th>
        <th>Airline Hub</th>
      </tr>

      <xsl:for-each select="AirportCodes/Airport">
        <tr>
          <td><xsl:value-of select="Code"/></td>
          <td><xsl:value-of select="AirportName"/></td>
          <td><xsl:value-of select="City"/></td>
          <td><xsl:value-of select="Country"/></td>
          <td><xsl:value-of select="Continent"/></td>
          <td><xsl:value-of select="AirlineHub"/></td>
        </tr>
      </xsl:for-each>
    </table>
</xsl:template>
</xsl:stylesheet>



