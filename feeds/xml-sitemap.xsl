<?xml version="1.0" encoding="UTF-8"?>
<!-- modified github.com/silverstripe-labs/silverstripe-googlesitemaps/blob/master/templates/xml-sitemap.xsl -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9" version="2.0">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>XML Sitemap</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
			</head>
			<body>
				<div id="content">
					<h1>
						<a href="http://silverstripe.org" target="_blank">
							XML Sitemap
							<span class="ss_link">→ silverstripe.org</span>
						</a>
					</h1>
					<p class="expl">
						This sitemap contains
						<xsl:value-of select="count(sitemap:urlset/sitemap:url)" />
						page URLs.
					</p>
					<table id="sitemap" cellpadding="3" class="tablesorter">
						<thead>
							<tr>
								<th width="76%">URL</th>
								<th width="7%">Priority</th>
								<th width="7%">Change Freq.</th>
								<th width="10%">Last Change</th>
							</tr>
						</thead>
						<tbody>
							<xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'" />
							<xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
							<xsl:for-each select="sitemap:urlset/sitemap:url">
								<tr>
									<td>
										<xsl:variable name="itemURL">
											<xsl:value-of select="sitemap:loc" />
										</xsl:variable>
										<a href="{$itemURL}">
											<xsl:value-of select="sitemap:loc" />
										</a>
									</td>
									<td>
										<xsl:value-of select="concat(sitemap:priority*100,'%')" />
									</td>
									<td>
										<xsl:value-of select="concat(translate(substring(sitemap:changefreq, 1, 1),concat($lower, $upper),concat($upper, $lower)),substring(sitemap:changefreq, 2))" />
									</td>
									<td>
										<xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)))" />
									</td>
								</tr>
							</xsl:for-each>
						</tbody>
					</table>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
